import { Router } from "express";
import { createUser, getUserRides, updateUser } from "./user.controller";

const router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/:id/rides", getUserRides);

export default router;
