export class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }

    createTodo = async (req, res, next) => {
        try {
            const { title } = req.body;
            const userId = req.user.id;

            const newTodo = await this.todoService.createTodo({
                title,
                userId,
            });

            return res.status(201).json({
                message: "Todo created successfully",
                data: newTodo,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllTodos = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const todos = await this.todoService.getAllTodosByUser(userId);
            return res.status(200).json({
                message: "Success",
                data: todos,
            });
        } catch (error) {
            next(error);
        }
    };

    getTodoById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const todo = await this.todoService.getTodoById(id);
            return res.status(200).json({
                message: "Success",
                data: todo,
            });
        } catch (error) {
            next(error);
        }
    };

    updateTodo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, completed } = req.body;
            const updatedTodo = await this.todoService.updateTodo(id, {
                title,
                completed,
            });
            return res.status(200).json({
                message: "Todo updated successfully",
                data: updatedTodo,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteTodo = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.todoService.deleteTodo(id);
            return res.status(200).json({
                message: "Todo deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
