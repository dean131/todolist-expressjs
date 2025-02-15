export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    createUser = async (data) => {
        return this.prisma.user.create({ data });
    };

    findUserByUsername = async (username) => {
        return this.prisma.user.findUnique({ where: { username } });
    };

    findUserById = async (id) => {
        return this.prisma.user.findUnique({ where: { id } });
    };
}
