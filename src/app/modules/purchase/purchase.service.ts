import { Prisma } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";
import { getContentStatus, getMovieStatus, withMovieStatus } from "../../../utils/access";

const createPurchaseInDB = async (
  userId: string,
  movieId: string,
  amount: number,
  transactionId: string,
) => {
  const existing = await prisma.purchase.findFirst({
    where: {
      OR: [{ transactionId }, { userId, movieId }],
    },
  });

  if (existing) {
    return existing;
  }

  try {
    return await prisma.purchase.create({
      data: {
        userId,
        movieId,
        amount,
        transactionId,
        paymentStatus: "PAID",
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const purchase = await prisma.purchase.findFirst({
        where: {
          OR: [{ transactionId }, { userId, movieId }],
        },
      });

      if (purchase) {
        return purchase;
      }
    }

    throw error;
  }
};

const checkMovieAccess = async (
  userId: string,
  userRole: string,
  movieId: string,
) => {
  if (userRole === "ADMIN") return true;

  const [movie, user] = await Promise.all([
    prisma.movie.findUnique({
      where: { id: movieId },
      select: {
        id: true,
        price: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: {
          select: {
            status: true,
            endDate: true,
          },
        },
      },
    }),
  ]);

  if (!movie) throw new Error("Movie not found");

  if (getMovieStatus(movie.price) === "FREE") return true;

  if (getContentStatus(user?.subscription) === "PREMIUM") {
    return true;
  }

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  return !!purchase;
};

const getMyPurchasesFromDB = async (userId: string) => {
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
    },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          year: true,
          genres: true,
          streamingUrl: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return purchases.map((purchase) => ({
    ...purchase,
    movie: withMovieStatus(purchase.movie),
  }));
};

export const PurchaseService = {
  createPurchaseInDB,
  checkMovieAccess,
  getMyPurchasesFromDB,
};
