import mongoose from "mongoose";
import { Post, User, Tag } from "../models/index.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req?.query?.page || 1);
  const cnt = parseInt(
    req?.query?.cnt || process.env.DEFAULT_POST_COUNT_PER_PAGE
  );
  const sort = req?.query?.sort || "id";
  const ord = req?.query?.ord || 1;
  const {
    date_gt,
    date_gte,
    date_lt,
    date_lte,
    id_gt,
    id_gte,
    id_lt,
    id_lte,
    field,
    keyword,
  } = req.query;

  try {
    let query = Post.find();

    switch (req?.query?.category) {
      case "favorites":
        if (!req?.user)
          return res
            .status(403)
            .send({ success: false, message: "Login required" });
        const currentUser = await User.findById(req.user.userId);
        query = query.find({ favorites: req.user.userId });
        break;
    }

    if (req?.query?.author) {
      if (!mongoose.Types.ObjectId.isValid(req.query.author))
        return res
          .status(403)
          .send({ success: false, message: "Invalid user id" });
      query = query.find({ author: req.query.author });
    }

    if (date_gt) query = query.find({ createdAt: { $gt: date_gt } });
    if (date_gte) query = query.find({ createdAt: { $gte: date_gte } });
    if (date_lt) query = query.find({ createdAt: { $lt: date_lt } });
    if (date_lte) query = query.find({ createdAt: { $lte: date_lte } });

    if (id_gt) query = query.find({ _id: { $gt: id_gt } });
    if (id_gte) query = query.find({ _id: { $gte: id_gte } });
    if (id_lt) query = query.find({ _id: { $lt: id_lt } });
    if (id_lte) query = query.find({ _id: { $lte: id_lte } });

    if (req.query.tags) {
      const tags = req.query.tags.split(',').filter(tag => mongoose.Types.ObjectId.isValid(tag));
      query = query.find({ tags: { $all: tags } });
    }

    if (keyword) {
      query = query.find({
        $and: keyword
          .split(" ")
          .map((key) => ({
            [field || "title"]: { $regex: new RegExp(key, "i") },
          })),
      });
    }

    switch (req.query.sort) {
      case "favorites":
        query = query.sort({ favoritesCount: ord });
        break;
      default:
        query = query.sort({ _id: ord });
    }

    const totalCnt = await Post.find().merge(query).countDocuments();
    const posts = await query.skip(cnt * (page - 1)).limit(cnt).populate('tags');
    const hasNext = cnt * (page - 1) + posts.length < totalCnt;

    res.json({
      totalCnt,
      posts,
      hasNext,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(403).send({ success: false, message: "Invalid post id" });
  try {
    const post = await Post.findById(id).populate('tags');
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const getNextPosts = async (req, res) => {
  const { id } = req.params;
  let { count } = req.params;

  if (!count) count = 1;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(403).send({ success: false, message: "Invalid post id" });
  try {
    const nextPosts = await Post.find({ _id: { $gt: id } })
      .sort({ _id: 1 })
      .limit(count);
    res.json(nextPosts);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const getPrevPosts = async (req, res) => {
  const { id } = req.params;
  let { count } = req.params;

  if (!count) count = 1;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(403).send({ success: false, message: "Invalid post id" });
  try {
    const nextPosts = await Post.find({ _id: { $lt: id } })
      .sort({ _id: -1 })
      .limit(count);
    res.json(nextPosts);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const createPost = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ success: false, message: "Login required" });

  try {
    const { post } = req.body;
    const currentUser = await User.findById(req.user.userId);

    post.author = req.user.userId;
    post.authorName = currentUser.nickname;
    post.tags = await Promise.all(
      post.tags.map(async (tag) => {
        if (tag._id && mongoose.Types.ObjectId.isValid(tag._id)) return tag._id;
        const tagDoc = await new Tag(tag).save();
        return tagDoc._id;
      })
    );

    const newPost = new Post(post);
    await newPost.save();
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const updatePost = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ success: false, message: "Login required" });

  try {
    const { id } = req.params;
    const { post } = req.body;
    const currentPost = await Post.findById(id);
    if (!currentPost.author.equals(req.user.userId))
      return res.status(403).send({ success: false, message: "Access denied" });

    post.tags = await Promise.all(
      post.tags.map(async (tag) => {
        if (tag._id && mongoose.Types.ObjectId.isValid(tag._id)) return tag._id;

        const tagDoc = await new Tag(tag).save();
        return tagDoc._id;
      })
    );
    await currentPost.updateOne(post);

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const deletePost = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ success: false, message: "Login required" });

  try {
    const { id } = req.params;
    const currentPost = await Post.findById(id);
    if (!currentPost.author.equals(req.user.userId))
      return res.status(403).send({ success: false, message: "Access denied" });
    await currentPost.delete();
    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const toggleLikePost = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ success: false, message: "Login required" });

  try {
    const { id } = req.params;
    const currentPost = await Post.findById(id);
    if (currentPost.likes.find((userId) => userId.equals(req.user.userId))) {
      await currentPost.updateOne({
        $pull: { likes: req.user.userId },
        $inc: { likesCount: -1 },
      });
    } else {
      await currentPost.updateOne({
        $push: { likes: req.user.userId },
        $inc: { likesCount: 1 },
      });
    }

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

export const toggleFavoritePost = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ success: false, message: "Login required" });

  try {
    const { id } = req.params;
    const currentPost = await Post.findById(id);
    const currentUser = await User.findById(req.user.userId);
    if (
      currentPost.favorites.find((userId) => userId.equals(req.user.userId))
    ) {
      await currentPost.updateOne({
        $pull: { favorites: req.user.userId },
        $inc: { favoritesCount: -1 },
      });
      await currentUser.updateOne({ $pull: { favoritePosts: id } });
    } else {
      await currentPost.updateOne({
        $push: { favorites: req.user.userId },
        $inc: { favoritesCount: 1 },
      });
      await currentUser.updateOne({ $push: { favoritePosts: id } });
    }

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};
