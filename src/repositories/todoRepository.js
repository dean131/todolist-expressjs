export class TodoRepository {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    async createTodo(data) {
        return this.prisma.todo.create({ data });
    }

    async getAllTodos() {
        return this.prisma.todo.findMany();
    }

    async getTodoById(id) {
        return this.prisma.todo.findUnique({
            where: { id: Number(id) },
        });
    }

    async updateTodo(id, data) {
        return this.prisma.todo.update({
            where: { id: Number(id) },
            data,
        });
    }

    async deleteTodo(id) {
        return this.prisma.todo.delete({
            where: { id: Number(id) },
        });
    }
}
