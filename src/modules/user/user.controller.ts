// src/modules/user/user.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import * as userService from "./user.service";

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const user = await userService.updateUser(id, req.body);
    res.json({ data: user, message: "User updated successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getUserRides = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const rides = await userService.getUserRides(id);
    res.json({ data: rides, message: "Rides for user successfully retrieved" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
