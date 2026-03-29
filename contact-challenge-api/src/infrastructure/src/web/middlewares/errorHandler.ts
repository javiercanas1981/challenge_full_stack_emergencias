import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { ApplicationError } from "../../../../application/src/errors/ApplicationError";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((e: ZodIssue) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof ApplicationError) {
    res.status(400).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(" [Fatal Error]:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });

  return;
}
