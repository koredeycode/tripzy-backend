import { Request, Response } from "express";
import * as driverService from "./driver.service";

export const getDrivers = (req: Request, res: Response) => {
  const drivers = driverService.getDrivers();
  res.json({ data: drivers, message: "Successfully retrived drivers" });
};
