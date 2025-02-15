import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

// Route Auth
app.use("/auth", authRoutes);

// Route Todo
app.use("/todos", todoRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
