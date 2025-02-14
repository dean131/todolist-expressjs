export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createUser(data) {
        return this.prisma.user.create({ data });
    }

    async findUserByUsername(username) {
        return this.prisma.user.findUnique({ where: { username } });
    }

    async findUserById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
