import { Router } from "express";
import {
  getAllPostsController,
  createPostController,
  updatePostController,
  deletePostController,
  getPostByIdController,
  addTagToPostController,
  removeTagFromPostController,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/", getAllPostsController);
router.post("/",authMiddleware, createPostController);
router.put("/:id",authMiddleware, updatePostController);
router.delete("/:id",authMiddleware, deletePostController);
router.get("/:id", getPostByIdController);


router.post("/:id/tags", authMiddleware,addTagToPostController);
router.delete("/:id/tags",authMiddleware, removeTagFromPostController);




export default router;
