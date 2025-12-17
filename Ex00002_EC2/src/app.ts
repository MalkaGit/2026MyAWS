//3 express app
import express from "express";
import songRoutes from "./routes/songRoutes";

const app = express();

app.use(express.json()); // parse JSON bodies
app.use("/songs", songRoutes);

export default app;
