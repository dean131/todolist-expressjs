// src/routes/authRoutes.js
import { Router } from "express";
import { authController } from "../container.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} from "../validators/authValidator.js";

const router = Router();

// Register user
router.post(
    "/register",
    validateRequest(registerSchema),
    authController.register
);
// Login user -> dapatkan access & refresh token
router.post("/login", validateRequest(loginSchema), authController.login);
// Refresh token
router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    authController.refreshToken
);

export default router;
