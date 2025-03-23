import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.validation";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post("/register", [
  validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
]);

router.post("/login", [
  validate(loginSchema), 
  asyncHandler(authController.login.bind(authController))
]);

router.post("/refresh-token", [
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken.bind(authController))
]);

// Protected routes
router.get("/me", [
  authMiddleware,
  asyncHandler(authController.getProfile.bind(authController))
]);

// Email verification
router.get("/verify-email/:token", 
  asyncHandler(authController.verifyEmail.bind(authController))
);

export default router;
