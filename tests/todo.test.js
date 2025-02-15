import request from "supertest";
import app from "../src/server.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Todo API (with Auth)", () => {
    let accessToken;
    let todoId;

    beforeAll(async () => {
        // 1. Pastikan DB bersih
        await prisma.todo.deleteMany({});
        await prisma.user.deleteMany({});

        // 2. Register user baru
        const registerResponse = await request(app)
            .post("/auth/register")
            .send({
                username: "john_doe",
                password: "secret123",
            });
        expect(registerResponse.status).toBe(201);

        // 3. Login untuk dapatkan accessToken
        const loginResponse = await request(app).post("/auth/login").send({
            username: "john_doe",
            password: "secret123",
        });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.data).toHaveProperty("accessToken");
        accessToken = loginResponse.body.data.accessToken;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Cek apakah token sudah di-set
    it("Should have an access token", () => {
        expect(accessToken).toBeDefined();
    });

    // 4. Tes Akses Tanpa Token
    it("Should fail when no token is provided (GET /todos)", async () => {
        const response = await request(app).get("/todos");
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "No token provided");
    });

    // 5. Create Todo dengan Token
    it("Should create a new todo (POST /todos) with valid token", async () => {
        const response = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "Belajar JWT" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.title).toBe("Belajar JWT");
        todoId = response.body.data.id;
    });

    // 6. Get All Todos dengan Token
    it("Should get all todos (GET /todos) with valid token", async () => {
        const response = await request(app)
            .get("/todos")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    // 7. Get Todo by ID
    it("Should get todo by ID (GET /todos/:id)", async () => {
        const response = await request(app)
            .get(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toMatchObject({
            id: todoId,
            title: "Belajar JWT",
            completed: false,
        });
    });

    // 8. Update Todo
    it("Should update todo (PUT /todos/:id)", async () => {
        const response = await request(app)
            .put(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "Update Judul", completed: true });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toMatchObject({
            id: todoId,
            title: "Update Judul",
            completed: true,
        });
    });

    // 9. Delete Todo
    it("Should delete todo (DELETE /todos/:id)", async () => {
        const response = await request(app)
            .delete(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "message",
            "Todo deleted successfully"
        );
    });

    // 10. Pastikan Todo tidak lagi ada
    it("Should return 404 (Not Found) when trying to get deleted todo", async () => {
        const response = await request(app)
            .get(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Todo not found");
    });
});
