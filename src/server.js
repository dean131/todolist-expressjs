import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

// Route Auth (Register, Login, Refresh Token)
app.use("/auth", authRoutes);

// Route Todo (dilindungi authMiddleware di dalam file)
app.use("/todos", todoRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
