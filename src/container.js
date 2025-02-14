import { PrismaClient } from "@prisma/client";
import { TodoRepository } from "./repositories/todoRepository.js";
import { TodoService } from "./services/todoService.js";
import { TodoController } from "./controllers/todoController.js";

const prisma = new PrismaClient();
const todoRepository = new TodoRepository(prisma);
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

export { prisma, todoRepository, todoService, todoController };
