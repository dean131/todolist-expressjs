import { AppError } from "../utils/appError.js";

export function validateRequest(schema) {
    return (req, res, next) => {
        // Lakukan validasi
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // agar semua error dikumpulkan, bukan berhenti di error pertama
            allowUnknown: true, // jika ada field lain yg tidak didefinisikan, tetap diizinkan
        });

        if (error) {
            // Kumpulkan semua pesan error
            const messages = error.details
                .map((detail) => detail.message)
                .join(", ");
            // Lempar sebagai AppError
            return next(new AppError(messages, 400));
        }

        // Jika valid, simpan hasil validasi ke req.body (value = hasil sanitize Joi)
        req.body = value;
        next();
    };
}
