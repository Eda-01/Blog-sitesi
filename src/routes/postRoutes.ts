import { Router } from "express";
import { getAllPostController, createPostController, updatePostController, deletePostController, getPostByIdController } from "../controllers/postController.js";

const router = Router();

router.get("/", getAllPostController);
router.post("/", createPostController);
router.put("/:id", updatePostController);
router.delete("/:id", deletePostController);
router.get("/:id", getPostByIdController);

export default router;