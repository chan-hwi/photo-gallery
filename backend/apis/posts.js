import mongoose from 'mongoose';
import { Post, User } from '../models/index.js';

export const getPosts = async (req, res) => {
    const page = parseInt(req?.query?.page || 1);
    const cnt = parseInt(req?.query?.cnt || process.env.DEFAULT_POST_COUNT_PER_PAGE);
    const sort = req?.query?.sort || 'id';
    const ord = req?.query?.ord || 1;

    try {
        let query = Post.find();

        switch (req?.query?.category) {
            case 'favorites':
                if (!req?.user) return res.status(403).send({ success: false, message: "Login required" });
                const currentUser = await User.findById(req.user.userId);
                query = query.find({ favorites: req.user.userId });
                break;
        }

        if (req?.query?.author) {
            if (!mongoose.Types.ObjectId.isValid(req.query.author)) return res.status(403).send({ success: false, message: "Invalid user id" });
            query = query.find({ author: req.query.author });
        }

        switch (req.query.sort) {
            case 'favorites':
                query = query.sort({ favoritesCount: ord });
                break;
            default:
                query = query.sort({ _id: ord });
        }
        
        const totalCnt = await Post.find().merge(query).countDocuments();
        const posts = await query.skip(cnt * (page - 1)).limit(cnt);
        const hasNext = cnt * (page - 1) + posts.length < totalCnt;

        res.json({
            totalCnt,
            posts,
            hasNext
        });
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
        await currentPost.updateOne(post);

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
        if (currentPost.likes.find(userId => userId.equals(req.user.userId))) {
            await currentPost.update({ $pull: { likes: req.user.userId }, $inc: { likesCount: -1 } });
        } else {
            await currentPost.update({ $push: { likes: req.user.userId }, $inc: { likesCount: 1 } });
        }

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
            await currentPost.update({ $pull: { favorites: req.user.userId }, $inc: { favoritesCount: -1 } });
            await currentUser.update({ $pull: { favoritePosts: id } });
        } else { 
            await currentPost.update({ $push: { favorites: req.user.userId }, $inc: { favoritesCount: 1 } });
            await currentUser.update({ $push: { favoritePosts: id } });
        }

        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}