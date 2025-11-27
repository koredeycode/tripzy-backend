// src/modules/user/user.controller.ts
import { Request, Response } from "express";
import * as userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user, message: "User created successfully" });
  } catch (err: any) {
    console.log({ err });
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// export const getUserByClerkId = async (req: Request, res: Response) => {
//   try {
//     const clerk_id = req.params.clerk_id;
//     const user = await userService.getUserByClerkId(clerk_id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ data: user, message: "User retrieved successfully" });
//   } catch (err: any) {
//     res.status(err.statusCode || 500).json({ error: err.message });
//   }
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await userService.updateUser(id, req.body);
    res.json({ data: user, message: "User updated successfully" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getUserRides = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const rides = await userService.getUserRides(id);
    res.json({ data: rides, message: "Rides for user successfully retrieved" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
