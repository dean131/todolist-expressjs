import { Router } from "express";
import { todoController } from "../container.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
    createTodoSchema,
    updateTodoSchema,
} from "../validators/todoValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Lindungi semua endpoint di bawah dengan authMiddleware
router.use(authMiddleware);

// POST /todos
router.post("/", validateRequest(createTodoSchema), todoController.createTodo);
// GET /todos
router.get("/", todoController.getAllTodos);
// GET /todos/:id
router.get("/:id", todoController.getTodoById);
// PUT /todos/:id
router.put(
    "/:id",
    validateRequest(updateTodoSchema),
    todoController.updateTodo
);
// DELETE /todos/:id
router.delete("/:id", todoController.deleteTodo);

export default router;
