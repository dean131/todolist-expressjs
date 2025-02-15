import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new AppError("Invalid token format", 401));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = { id: payload.userId };
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
};
