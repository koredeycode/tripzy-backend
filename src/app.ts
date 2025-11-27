import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

dotenv.config();

const app = express();

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors());

// Main router
app.use("/api", router);

app.use(errorHandler);

export default app;
