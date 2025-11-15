import { Request, Response } from "express";

import * as userService from "./user.service";

export const createUser = (req: Request, res: Response) => {
  const user = userService.createUser();
  res.json({ data: user, message: "User created successfully" });
};

export const updateUser = (req: Request, res: Response) => {
  const user = userService.updateUser();
  res.json({ data: user, message: "User updated successfully" });
};

export const getUserRides = (req: Request, res: Response) => {
  const rides = userService.getUserRides();
  res.json({ data: rides, message: "Rides for user successfully retrieved" });
};
