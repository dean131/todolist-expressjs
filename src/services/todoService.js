import { AppError } from "../utils/appError.js";

export class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    createTodo = async (data) => {
        return this.todoRepository.createTodo(data);
    };

    getAllTodosByUser = async (userId) => {
        return this.todoRepository.getAllTodosByUser(userId);
    };

    getTodoById = async (id) => {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo) {
            throw new AppError("Todo not found", 404);
        }
        return todo;
    };

    updateTodo = async (id, data) => {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo) {
            throw new AppError("Todo not found", 404);
        }
        return this.todoRepository.updateTodo(id, data);
    };

    deleteTodo = async (id) => {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo) {
            throw new AppError("Todo not found", 404);
        }
        return this.todoRepository.deleteTodo(id);
    };
}
