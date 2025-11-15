// src/modules/driver/driver.controller.ts
import { Request, Response } from "express";
import * as driverService from "./driver.service";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await driverService.getDrivers();
    res.json({ data: drivers, message: "Successfully retrieved drivers" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
