import { Router } from "express";
import { createItem, deleteItem, itemDetails, listItems, updateItem } from "../controllers/tagController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/",authMiddleware, createItem);
router.get("/", listItems);
router.get("/:id", itemDetails);
router.put("/:id",authMiddleware, updateItem);
router.delete("/:id",authMiddleware, deleteItem);

export default router;