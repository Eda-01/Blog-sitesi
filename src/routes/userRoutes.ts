import { Router } from "express";
import { createUserController, deleteUserController, getAllUsersController, getUserByIdController, updateUserController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllUsersController);
router.post("/",authMiddleware, createUserController);
router.get("/:id", getUserByIdController);
router.patch("/:id", authMiddleware,updateUserController);
router.delete("/:id",authMiddleware, deleteUserController);


export default router;