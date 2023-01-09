import express from "express";
import {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment
} from "../apis/comments.js";

const router = express.Router();

router.get("/", getComments);

router.get("/:commentId/replies", getReplies);

router.post(["/:postId", "/:postId/replies/:commentId"], createComment);

router.patch("/:id", updateComment);

router.delete("/:id", deleteComment);

export default router;
