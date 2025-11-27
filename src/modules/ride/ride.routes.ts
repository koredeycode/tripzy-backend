import { Router } from "express";
import { authenticateToken, authorizeRideAccess } from "../../middleware/authMiddleware";
import {
    createRide,
    getRide
} from "./ride.controller";

const router = Router();

router.post("/", authenticateToken, createRide);
router.get("/:id", authenticateToken, authorizeRideAccess, getRide);

export default router;
