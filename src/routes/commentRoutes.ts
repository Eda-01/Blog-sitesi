import { Router } from "express";
import { getAllCommentController, createCommentController, updateCommentController, deleteCommentController, getCommentByIdController } from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/", getAllCommentController);
router.post("/",authMiddleware, createCommentController);
router.put("/:id",authMiddleware, updateCommentController);
router.delete("/:id",authMiddleware, deleteCommentController);
router.get("/:id", getCommentByIdController);

export default router;