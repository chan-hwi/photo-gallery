import mongoose from 'mongoose';
import { Post, User } from '../models/index.js';

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch(e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(403).send({ success: false, message: "Invalid post id" });
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const getNextPosts = async (req, res) => {
    const { id } = req.params;
    let { count } = req.params;

    if (!count) count = 1;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(403).send({ success: false, message: "Invalid post id" });
    try {
        const nextPosts = await Post.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(count);
        res.json(nextPosts);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const getPrevPosts = async (req, res) => {
    const { id } = req.params;
    let { count } = req.params;

    if (!count) count = 1;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(403).send({ success: false, message: "Invalid post id" });
    try {
        const nextPosts = await Post.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(count);
        res.json(nextPosts);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const createPost = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: "Login required" });

    try {
        const { post } = req.body;
        const currentUser = await User.findById(req.user.userId);

        post.author = req.user.userId;
        post.authorName = currentUser.nickname;

        const newPost = new Post(post);
        await newPost.save();
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const updatePost = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: "Login required" });
    
    try {
        const { id } = req.params;
        const { post } = req.body;
        const currentPost = await Post.findById(id);
        if (!currentPost.author.equals(req.user.userId)) return res.status(403).send({ success: false, message: "Access denied" });
        await currentPost.update(post);

        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const deletePost = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: "Login required" });

    try {
        const { id } = req.params;
        const currentPost = await Post.findById(id);
        if (!currentPost.author.equals(req.user.userId)) return res.status(403).send({ success: false, message: "Access denied" });
        await currentPost.delete();
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const toggleLikePost = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: "Login required" });

    try {
        const { id } = req.params;
        const currentPost = await Post.findById(id);
        if (currentPost.likes.find(userId => userId.equals(req.user.userId))) 
            currentPost.likes = currentPost.likes.filter(userId => !userId.equals(req.user.userId));
        else 
            currentPost.likes.push(req.user.userId);
        
        await currentPost.save();
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const toggleFavoritePost = async (req, res) => {
    if (!req.user) return res.status(401).send({ success: false, message: "Login required" });

    try {
        const { id } = req.params;
        const currentPost = await Post.findById(id);
        const currentUser = await User.findById(req.user.userId);
        if (currentPost.favorites.find(userId => userId.equals(req.user.userId))) {
            currentPost.favorites = currentPost.favorites.filter(userId => !userId.equals(req.user.userId));
            currentUser.favoritePosts = currentUser.favoritePosts.filter(postId => !postId.equals(id));
        } else { 
            currentPost.favorites.push(req.user.userId);
            currentUser.favoritePosts.push(id);
        }

        await currentPost.save();
        await currentUser.save();
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}