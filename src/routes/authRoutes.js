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

router.post("/login", validateRequest(loginSchema), authController.login);
router.post(
    "/register",
    validateRequest(registerSchema),
    authController.register
);
router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    authController.refreshToken
);

export default router;
