import { Router } from "express";
import {
  createUser,
  getUserByClerkId,
  getUserRides,
  updateUser,
} from "./user.controller";

const router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/:clerk_id", getUserByClerkId);
router.get("/:id/rides", getUserRides);

export default router;
