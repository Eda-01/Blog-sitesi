import { Router } from "express";
import { getAllCommentController, createCommentController, updateCommentController, deleteCommentController, getCommentByIdController } from "../controllers/commentController.js";

const router = Router();

router.get("/", getAllCommentController);
router.post("/", createCommentController);
router.put("/:id", updateCommentController);
router.delete("/:id", deleteCommentController);
router.get("/:id", getCommentByIdController);

export default router;