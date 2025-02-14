import { PrismaClient } from "@prisma/client";
import { TodoRepository } from "./repositories/todoRepository.js";
import { TodoService } from "./services/todoService.js";
import { TodoController } from "./controllers/todoController.js";

import { UserRepository } from "./repositories/userRepository.js";
import { AuthService } from "./services/authService.js";
import { AuthController } from "./controllers/authController.js";

const prisma = new PrismaClient();

// Repos
const todoRepository = new TodoRepository(prisma);
const userRepository = new UserRepository(prisma);

// Services
const todoService = new TodoService(todoRepository);
const authService = new AuthService(userRepository);

// Controllers
const todoController = new TodoController(todoService);
const authController = new AuthController(authService);

export {
    prisma,
    // repositories
    todoRepository,
    userRepository,
    // services
    todoService,
    authService,
    // controllers
    todoController,
    authController,
};
