import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Main router
app.use("/api", router);

export default app;
