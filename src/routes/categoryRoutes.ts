import { Router } from "express";
import { getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController, getCategoryByIdController } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategoriesController);
router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);
router.get("/:id", getCategoryByIdController);

export default router;
