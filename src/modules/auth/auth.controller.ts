import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as authService from './auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password, profile_image_url } = req.body;
    const result = await authService.signup({ first_name, last_name, email, password_hash: password, profile_image_url });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await authService.getProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
