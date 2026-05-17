import { ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

type RequestValidationResult = {
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  cookies?: Record<string, unknown>;
};

export const validateRequest = (schema: ZodSchema<RequestValidationResult>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    req.body = parsedData.body;

    if (parsedData.query) {
        Object.assign(req.query, parsedData.query);
    }
    if (parsedData.params) {
        Object.assign(req.params, parsedData.params);
    }
    
    // req.cookies is also generally writable, but Object.assign is safer
    if (parsedData.cookies) {
        req.cookies = parsedData.cookies;
    }

    next();
  });
};
