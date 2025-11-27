// src/modules/ride/ride.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import * as rideService from "./ride.service";

export const createRide = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rideData = { ...req.body, user_id: userId };
    const ride = await rideService.createRide(rideData);
    res.status(201).json({ data: ride, message: "Ride created successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getRide = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const ride = await rideService.getRide(id);
    res.json({ data: ride, message: "Ride retrieved successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
