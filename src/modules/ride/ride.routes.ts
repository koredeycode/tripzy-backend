import { Router } from "express";
import { createRide, getRide } from "./ride.controller";

const router = Router();

router.post("/", createRide);
router.get("/:id", getRide);

export default router;
