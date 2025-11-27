import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getRide } from '../modules/ride/ride.service';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role?: string;
    isDriver?: boolean;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'your_jwt_secret') as { userId: string; role?: string; isDriver?: boolean };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

export const authorizeUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const paramId = req.params.id;

  if (userId !== paramId) {
    return res.status(403).json({ error: 'Unauthorized access to user profile' });
  }
  next();
};

export const authorizeRideAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const rideId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ride = await getRide(rideId);

    // Check if user is the rider
    if (ride.user_id === userId) {
      return next();
    }

    // TODO: Check if user is the driver of the ride
    // For now, restrict to rider as per previous implementation
    
    return res.status(403).json({ error: 'Unauthorized access to ride details' });
  } catch (error) {
    next(error);
  }
};
