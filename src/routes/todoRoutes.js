import { Router } from "express";
import { todoController } from "../container.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
    createTodoSchema,
    updateTodoSchema,
} from "../validators/todoValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateRequest(createTodoSchema), todoController.createTodo);
router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getTodoById);
router.put(
    "/:id",
    validateRequest(updateTodoSchema),
    todoController.updateTodo
);
router.delete("/:id", todoController.deleteTodo);

export default router;
