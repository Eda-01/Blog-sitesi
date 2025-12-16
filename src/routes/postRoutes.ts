import { Router } from "express";
import {
  getAllPostController,
  createPostController,
  updatePostController,
  deletePostController,
  getPostByIdController,
} from "../controllers/postController.js";
import { addTagToPostController, removeTagFromPostController } from "../controllers/tagController.js";

const router = Router();

router.get("/", getAllPostController);
router.post("/", createPostController);
router.patch("/:id", updatePostController);
router.delete("/:id", deletePostController);
router.get("/:id", getPostByIdController);

// Post tag iliskileri
router.post("/:id/tags", addTagToPostController);
router.delete("/:id/tags", removeTagFromPostController);

export default router;
