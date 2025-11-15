import { Request, Response } from "express";
import * as rideService from "./ride.service";

export const createRide = (req: Request, res: Response) => {
  const ride = rideService.createRide();
  res.json({ data: ride, message: "Ride created successfully" });
};

export const getRide = (req: Request, res: Response) => {
  const ride = rideService.getRide();
  res.json({ data: ride, message: "Ride retrieved successfully" });
};
