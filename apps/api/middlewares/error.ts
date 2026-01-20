import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const statusCode = 500;
  const message = err.message || "Internal Server Error";   

  res.status(statusCode).json({
    success: false,
    message,
  });
};
