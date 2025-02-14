import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export function authMiddleware(req, res, next) {
    // Biasanya header 'Authorization: Bearer <access_token>'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1]; // ambil bagian setelah 'Bearer'
    if (!token) {
        return next(new AppError("Invalid token format", 401));
    }

    try {
        // Verifikasi access token
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // payload berisi { userId, iat, exp, ... }
        req.user = { id: payload.userId };
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
}
