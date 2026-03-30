import { prisma } from "../../../lib/prisma";

const getAdminStats = async () => {
  const [totalRevenue, totalUsers, totalMovies, mostReviewed] = await Promise.all([
    // 1. Sum of all successful purchases
    prisma.purchase.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "completed" }
    }),
    // 2. Total active users
    prisma.user.count({ where: { isBlocked: false } }),
    // 3. Total library size
    prisma.movie.count(),
    // 4. Most reviewed movies (Top 5)
    prisma.movie.findMany({
      take: 5,
      include: {
        _count: { select: { reviews: true } }
      },
      orderBy: {
        reviews: { _count: 'desc' }
      }
    })
  ]);

  return {
    revenue: totalRevenue._sum.amount || 0,
    userCount: totalUsers,
    movieCount: totalMovies,
    trendingMovies: mostReviewed
  };
};

export const AdminService = {
  getAdminStats
};