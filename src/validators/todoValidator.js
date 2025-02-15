import Joi from "joi";

export const createTodoSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "any.required": "Title is required",
    }),
});

export const updateTodoSchema = Joi.object({
    title: Joi.string().min(1).optional().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
    }),
    completed: Joi.boolean().optional(),
});
