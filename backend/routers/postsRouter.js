import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleFavoritePost,
  getNextPosts,
  getPrevPosts,
} from "../apis/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get(["/:id/next", "/:id/next/:count"], getNextPosts);
router.get(["/:id/prev", "/:id/prev/:count"], getPrevPosts);

router.post("/", createPost);

router.patch("/:id", updatePost);
router.patch("/:id/likes", toggleLikePost);
router.patch("/:id/favorites", toggleFavoritePost);

router.delete("/:id", deletePost);

export default router;
