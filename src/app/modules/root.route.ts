import { Request, Response } from "express";

export const rootRoute = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Movie Server Is Running",
  });
};
