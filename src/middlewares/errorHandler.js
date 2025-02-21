import { AppError } from "../utils/appError.js";

export const errorHandler = async (err, req, res, next) => {
    console.error(err);
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    return res.status(statusCode).json({
        error: true,
        message: message,
    });
};
