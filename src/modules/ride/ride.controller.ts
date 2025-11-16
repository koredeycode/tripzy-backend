// src/modules/ride/ride.controller.ts
import { Request, Response } from "express";
import * as rideService from "./ride.service";

export const createRide = async (req: Request, res: Response) => {
  try {
    const ride = await rideService.createRide(req.body);
    res.status(201).json({ data: ride, message: "Ride created successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getRide = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ride = await rideService.getRide(id);
    res.json({ data: ride, message: "Ride retrieved successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

//TODO  delete Ride
