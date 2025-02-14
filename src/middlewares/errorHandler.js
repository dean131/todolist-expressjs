import { AppError } from "../utils/appError.js";

export function errorHandler(err, req, res, next) {
    // Default error
    let statusCode = 500;
    let message = "Internal Server Error";

    // Jika error adalah instance AppError (dilempar manual di service/controller)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    return res.status(statusCode).json({
        error: true,
        message: message,
    });
}
