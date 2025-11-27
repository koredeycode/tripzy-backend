import { Router } from "express";
import { authenticateToken, authorizeUser } from "../../middleware/authMiddleware";
import {
    getUserRides,
    updateUser
} from "./user.controller";

const router = Router();

router.put("/:id", authenticateToken, authorizeUser, updateUser);
router.get("/:id/rides", authenticateToken, authorizeUser, getUserRides);

export default router;
