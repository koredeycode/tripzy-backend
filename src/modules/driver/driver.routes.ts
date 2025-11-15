import { Router } from "express";
import { getDrivers } from "./driver.controller";

const router = Router();

router.get("/", getDrivers);

export default router;
