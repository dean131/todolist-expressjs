import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Todo API!");
});

app.use(errorHandler);

export default app;
