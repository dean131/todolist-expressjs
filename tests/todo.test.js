import request from "supertest";
import app from "../src/server.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Todo API", () => {
    // Variabel untuk menyimpan ID Todo yang baru dibuat
    let todoId;

    // Bersihkan data di tabel "Todo" sebelum setiap test (opsional, tergantung kebutuhan)
    beforeAll(async () => {
        // Pastikan DB siap atau bisa hapus data di sini
        await prisma.todo.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // 1. Create Todo
    it("Should create a new todo (POST /todos)", async () => {
        const response = await request(app)
            .post("/todos")
            .send({ title: "Belajar Testing Jest" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
            "message",
            "Todo created successfully"
        );
        expect(response.body).toHaveProperty("data");

        todoId = response.body.data.id;
        // Memastikan property data sesuai
        expect(response.body.data).toMatchObject({
            title: "Belajar Testing Jest",
            completed: false,
        });
    });

    // 2. Get All Todos
    it("Should get all todos (GET /todos)", async () => {
        const response = await request(app).get("/todos");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    // 3. Get Todo by ID
    it("Should get todo by ID (GET /todos/:id)", async () => {
        const response = await request(app).get(`/todos/${todoId}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("id", todoId);
        expect(response.body.data).toHaveProperty(
            "title",
            "Belajar Testing Jest"
        );
    });

    // 4. Update Todo
    it("Should update todo (PUT /todos/:id)", async () => {
        const newTitle = "Updated Title";
        const response = await request(app)
            .put(`/todos/${todoId}`)
            .send({ title: newTitle, completed: true });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Todo updated successfully");
        expect(response.body.data.title).toBe(newTitle);
        expect(response.body.data.completed).toBe(true);
    });

    // 5. Delete Todo
    it("Should delete todo (DELETE /todos/:id)", async () => {
        const response = await request(app).delete(`/todos/${todoId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "message",
            "Todo deleted successfully"
        );
    });

    // 6. Get Todo by ID (Not Found)
    it("Should return 404 if todo not found (GET /todos/:id)", async () => {
        const response = await request(app).get(`/todos/${todoId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Todo not found");
    });
});
