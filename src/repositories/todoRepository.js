export class TodoRepository {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    createTodo = async (data) => {
        console.log(data);
        return this.prisma.todo.create({ data });
    };

    getAllTodosByUser = async (userId) => {
        return this.prisma.todo.findMany({
            where: { userId },
        });
    };

    getTodoById = async (id) => {
        return this.prisma.todo.findUnique({
            where: { id: Number(id) },
        });
    };

    updateTodo = async (id, data) => {
        return this.prisma.todo.update({
            where: { id: Number(id) },
            data,
        });
    };

    deleteTodo = async (id) => {
        return this.prisma.todo.delete({
            where: { id: Number(id) },
        });
    };
}
