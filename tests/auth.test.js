import request from "supertest";
import app from "../src/server.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth API", () => {
    // Anda bisa menyimpan data global di sini, misalnya untuk diakses test lain
    let refreshToken;

    beforeAll(async () => {
        // Bersihkan data user di DB
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("Should register a new user (POST /auth/register)", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "john_doe",
            password: "secret123",
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.username).toBe("john_doe");
    });

    it("Should fail to register a duplicate user (POST /auth/register)", async () => {
        // Mencoba register lagi dengan username sama
        const response = await request(app).post("/auth/register").send({
            username: "john_doe", // sama
            password: "secret123",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "message",
            "Username already exists"
        );
    });

    it("Should login user and provide tokens (POST /auth/login)", async () => {
        const response = await request(app).post("/auth/login").send({
            username: "john_doe",
            password: "secret123",
        });
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("accessToken");
        expect(response.body.data).toHaveProperty("refreshToken");

        // Simpan refresh token untuk test refresh
        refreshToken = response.body.data.refreshToken;
    });

    it("Should fail login with invalid password (POST /auth/login)", async () => {
        const response = await request(app).post("/auth/login").send({
            username: "john_doe",
            password: "wrongpassword",
        });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("Should refresh tokens (POST /auth/refresh)", async () => {
        const response = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken });
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("accessToken");
        expect(response.body.data).toHaveProperty("refreshToken");
    });

    it("Should fail refresh with invalid token (POST /auth/refresh)", async () => {
        const response = await request(app).post("/auth/refresh").send({
            refreshToken: "thisIsNotAValidToken",
        });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            "message",
            "Invalid refresh token"
        );
    });
});
