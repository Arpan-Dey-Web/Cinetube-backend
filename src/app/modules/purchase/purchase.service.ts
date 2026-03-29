import { prisma } from "../../../lib/prisma";

const createPurchaseInDB = async (userId: string, movieId: string, amount: number, transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Record the transaction
    const purchase = await tx.purchase.create({
      data: {
        userId,
        movieId,
        amount,
        transactionId,
        paymentStatus: "completed",
      },
    });

    // 2. If the user bought a subscription, update their role to PREMIUM
    // (Optional logic based on your Pricing requirements)
    await tx.user.update({
      where: { id: userId },
      data: { contentStatus: "PREMIUM" },
    });

    return purchase;
  });
};

const checkMovieAccess = async (userId: string, userRole: string, movieId: string) => {
  // 1. Admins get a free pass
  if (userRole === "ADMIN") return true;

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) throw new Error("Movie not found");

  // 2. If movie is free, everyone can watch
  if (movie.status === "FREE") return true;

  // 3. Check for specific purchase
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  return !!purchase;
};



const getMyPurchasesFromDB = async (userId: string) => {
  return await prisma.purchase.findMany({
    where: { 
      userId 
    },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          year: true,
          genres: true,
        }
      }
    },
    orderBy: { 
      createdAt: 'desc' 
    }
  });
};
export const PurchaseService = {
  createPurchaseInDB,
  checkMovieAccess,
  getMyPurchasesFromDB
  
};