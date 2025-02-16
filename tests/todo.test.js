import request from "supertest";
import app from "../src/server.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Todo API", () => {
    let accessToken;
    let todoId;

    beforeAll(async () => {
        // Hapus semua todo & user agar bersih
        await prisma.todo.deleteMany({});
        await prisma.user.deleteMany({});

        // 1) Register user
        await request(app).post("/auth/register").send({
            username: "john_doe",
            password: "secret123",
        });

        // 2) Login untuk dapatkan token
        const loginResponse = await request(app).post("/auth/login").send({
            username: "john_doe",
            password: "secret123",
        });
        expect(loginResponse.status).toBe(200);
        accessToken = loginResponse.body.data.accessToken;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("Should fail when no token is provided (GET /todos)", async () => {
        const response = await request(app).get("/todos");
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "No token provided");
    });

    it("Should create a new todo (POST /todos)", async () => {
        const response = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "Belajar JWT" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.title).toBe("Belajar JWT");
        todoId = response.body.data.id;
    });

    it("Should get all todos (GET /todos)", async () => {
        const response = await request(app)
            .get("/todos")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("Should get todo by ID (GET /todos/:id)", async () => {
        const response = await request(app)
            .get(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.id).toBe(todoId);
    });

    it("Should update todo (PUT /todos/:id)", async () => {
        const response = await request(app)
            .put(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "Updated Todo", completed: true });

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("Updated Todo");
        expect(response.body.data.completed).toBe(true);
    });

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

    it("Should return 404 after deleting todo (GET /todos/:id)", async () => {
        const response = await request(app)
            .get(`/todos/${todoId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Todo not found");
    });
});
