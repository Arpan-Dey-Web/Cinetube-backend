import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/client";

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || err.statuscode || 500;
  let message = err.message || "Something went wrong!";
  let errorSources: { path: string; message: string }[] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry: you've already performed this action.";
    }

    if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested resource was not found.";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
