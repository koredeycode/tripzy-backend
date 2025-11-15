import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  const status = err instanceof AppError ? err.statusCode : 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
