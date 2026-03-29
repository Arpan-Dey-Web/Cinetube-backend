import {  ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

/**
 * We use ZodSchema here because it is the most generic 
 * type that covers ZodObject, ZodEffects, etc.
 */
export const validateRequest = (schema: ZodSchema<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    // We assign the parsed/transformed data back to the request.
    // This ensures that if Zod converted a string to a Number, 
    // your controller gets the Number.
    req.body = parsedData.body;
    req.query = parsedData.query;
    req.params = parsedData.params;
    req.cookies = parsedData.cookies;
    
    next();
  });
};