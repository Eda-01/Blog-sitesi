import { Router } from "express";
import { getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController, getCategoryByIdController } from "../controllers/categoryController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Herkes listeleyebilir ve görüntüleyebilir
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// Sadece Admin oluşturabilir, güncelleyebilir ve silebilir
router.post("/", authenticateToken, authorizeRoles('admin'), createCategoryController);
router.patch("/:id", authenticateToken, authorizeRoles('admin'), updateCategoryController); // PUT yerine PATCH istendi
router.delete("/:id", authenticateToken, authorizeRoles('admin'), deleteCategoryController);

export default router;
