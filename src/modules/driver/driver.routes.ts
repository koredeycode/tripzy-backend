import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import {
    getDriver,
    getDrivers
} from "./driver.controller";

const router = Router();

router.get("/", authenticateToken, getDrivers);
router.get("/:id", authenticateToken, getDriver);

export default router;
