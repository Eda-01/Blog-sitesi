import { Router } from "express";
import { getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController, getCategoryByIdController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();


router.get("/", getAllCategoriesController);
router.post("/",authMiddleware, createCategoryController);
router.patch("/:id",authMiddleware, updateCategoryController);
router.delete("/:id",authMiddleware, deleteCategoryController);
router.get("/:id", getCategoryByIdController);


export default router;
