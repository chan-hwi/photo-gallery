import mongoose from 'mongoose';
import { Post, User, Comment } from '../models/index.js';

export const getComments = async (req, res) => {
    const { pid } = req.query;
    const page = parseInt(req?.query.page) || 1;
    const cnt = parseInt(req?.query?.cnt || process.env.DEFAULT_REPLY_COUNT_PER_PAGE);
    const { sort, ord } = req.query;

    try {
        if (!pid) return res.json(await Comment.find());
        if (!mongoose.Types.ObjectId.isValid(pid)) return res.status(403).send({ success: false, message: "Invalid post id" });
        const commentQuery = Comment.find({ post: pid });
        const rootQuery = Comment.find().merge(commentQuery).find({ parent: null });

        const totalCnt = await commentQuery.count();
        const rootCnt = await Comment.find().merge(rootQuery).count();
        const comments = await rootQuery.skip(cnt * (page - 1)).limit(cnt);
        const hasNext = cnt * (page - 1) + comments.length < rootCnt;

        res.json({
            totalCnt,
            rootCnt,
            comments,
            hasNext
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

export const getReplies = async (req, res) => {
    const { commentId } = req.params;
    const page = parseInt(req?.query.page) || 1;
    const cnt = parseInt(req?.query?.cnt || process.env.DEFAULT_REPLY_COUNT_PER_PAGE);

    try {
        if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(403).send({ success: false, message: "Invalid comment id" });
        const replyQuery = Comment.find({ parent: commentId });

        const totalCnt = await Comment.find().merge(replyQuery).count();
        const replies = await replyQuery.skip(cnt * (page - 1)).limit(cnt);
        const hasNext = cnt * (page - 1) + replies.length < totalCnt;

        res.json({
            totalCnt,
            replies,
            hasNext
        });
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
            newComment.parent = commentId;
            await Comment.findByIdAndUpdate(commentId, { $inc: { replyCount: 1 } });
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

        if (currentComment.parent)
            await Comment.findByIdAndUpdate(currentComment.parent, { $inc: { replyCount: -1 } });

        await currentComment.delete();
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}