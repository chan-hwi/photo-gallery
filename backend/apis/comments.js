import mongoose from 'mongoose';
import { Post, User, Comment } from '../models/index.js';

export const getComments = async (req, res) => {
    const { pid } = req.query;
    try {
        if (!pid) return res.json(await Comment.find());
        if (!mongoose.Types.ObjectId.isValid(pid)) return res.status(403).send({ success: false, message: "Invalid post id" });
        return res.json(await Comment.find({ post: pid }));
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const getReplies = async (req, res) => {
    const { commentId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(403).send({ success: false, message: "Invalid comment id" });

        const aaa = await Comment.findById(commentId).populate('replies');
        console.log(aaa);
        res.json(aaa.replies);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const createComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    if (!req.user) return res.status(403).send({ success: false, message: "Login required" });

    try {
        const currentUser = await User.findById(req.user.userId);
        if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(403).send({ success: false, message: "Invalid post id" });
        const newComment = new Comment(comment);

        newComment.post = postId;
        newComment.author = currentUser._id;
        newComment.authorName = currentUser.nickname;

        if (commentId) {
            if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(403).send({ success: false, message: "Invalid comment id" });
            newComment.isReply = true;
            const parentComment = await Comment.findById(commentId);
            parentComment.replies.push(newComment._id);
            await parentComment.save();
        }

        await newComment.save();
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    if (!req.user) return res.status(403).send({ success: false, message: "Login required" });
    
    try {
        if (!mongoose.Schema.Types.ObjectId(id)) return res.status(403).send({ success: false, message: "Invalid comment id" });
        const currentComment = await Comment.findById(id);
        if (!currentComment.author.equals(req.user.userId)) return res.status(403).send({ success: false, message: "Access denied" });
        await currentComment.update(comment);
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    if (!req.user) return res.status(403).send({ success: false, message: "Login required" });
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(403).send({ success: false, message: "Invalid comment id" });
        const currentComment = await Comment.findById(id);
        if (!currentComment.author.equals(req.user.userId)) return res.status(403).send({ success: false, message: "Access denied" });
        await currentComment.delete();
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}