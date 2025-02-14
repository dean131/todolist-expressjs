import Joi from "joi";

// Schema untuk validasi create Todo
export const createTodoSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "any.required": "Title is required",
    }),
});

// Schema untuk validasi update Todo
export const updateTodoSchema = Joi.object({
    title: Joi.string().min(1).optional().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
    }),
    completed: Joi.boolean().optional(),
});
