import { AppError } from "../utils/appError.js";

export const validateRequest = (schema) => async (req, res, next) => {
    try {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            const messages = error.details
                .map((detail) => detail.message)
                .join(", ");
            throw new AppError(messages, 400);
        }

        req.body = value;

        next();
    } catch (err) {
        next(err);
    }
};
