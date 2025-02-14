import { AppError } from "../utils/appError.js";

export class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTodo(data) {
        // Contoh validasi: title tidak boleh kosong
        if (!data.title || data.title.trim() === "") {
            throw new AppError("Title is required", 400);
        }
        // Lanjut buat di DB
        return this.todoRepository.createTodo(data);
    }

    async getAllTodos() {
        return this.todoRepository.getAllTodos();
    }

    async getTodoById(id) {
        const todo = await this.todoRepository.getTodoById(id);
        if (!todo) {
            // Throw manual error
            throw new AppError("Todo not found", 404);
        }
        return todo;
    }

    async updateTodo(id, data) {
        // Contoh: jika user tidak isi data, throw error 400
        if (!data.title && data.completed === undefined) {
            throw new AppError("No data provided to update", 400);
        }
        return this.todoRepository.updateTodo(id, data);
    }

    async deleteTodo(id) {
        return this.todoRepository.deleteTodo(id);
    }
}
