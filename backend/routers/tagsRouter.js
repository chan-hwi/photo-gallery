import express from "express";
import {
  getTags
} from "../apis/tags.js";

const router = express.Router();

router.get("/", getTags); 

export default router;
