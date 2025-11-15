import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Main router
app.use("/api", router);

app.use(errorHandler);

export default app;
