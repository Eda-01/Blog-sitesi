import { Router } from "express";
import { loginController, logoutController, refreshTokenController, registerController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth.middleware";
import { meController } from "../controllers/userController";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/me", authMiddleware, meController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout",logoutController);

export default router;