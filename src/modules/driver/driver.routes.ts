import { Router } from "express";
import { getDrivers, getDriver } from "./driver.controller";

const router = Router();

router.get("/", getDrivers);
router.get("/:id", getDriver);

export default router;
