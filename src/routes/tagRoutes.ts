import { Router } from "express";
import {
  getAllTagsController,
  createTagController,
  updateTagController,
  deleteTagController,
  getTagByIdController,
} from "../controllers/tagController.js";

const router = Router();

router.get("/", getAllTagsController);
router.post("/", createTagController);
router.patch("/:id", updateTagController);
router.delete("/:id", deleteTagController);
router.get("/:id", getTagByIdController);

export default router;


