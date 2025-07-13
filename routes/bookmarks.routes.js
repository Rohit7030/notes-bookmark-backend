import express from "express";
import {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
} from "../controllers/bookmarks.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate); // protect all routes

router.post("/", createBookmark);
router.get("/", getBookmarks);
router.get("/:id", getBookmarkById);
router.put("/:id", updateBookmark);
router.delete("/:id", deleteBookmark);

export default router;
