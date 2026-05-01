import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { getContentStatus } from "../../utils/access";
import { IRequestUser } from "../../types/types";

const getSessionUser = async (req: Request) => {
  const session = await betterAuth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBlocked: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      subscription: {
        select: {
          status: true,
          endDate: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const { subscription, ...userFields } = user;

  return {
    ...userFields,
    contentStatus: getContentStatus(subscription),
  } satisfies IRequestUser;
};

export const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Please log in.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated by an admin.",
      });
    }

    // 5. Role check (Case-insensitive check is safer if your DB enums vary)
    if (roles.length > 0) {
      const hasRole = roles.includes(user.role);
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Insufficient permissions.",
        });
      }
    }

    req.user = user;
    next();
  });
};

export const optionalAuth = () => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const user = await getSessionUser(req);

    if (user && !user.isBlocked) {
      req.user = user;
    }

    next();
  });
};
