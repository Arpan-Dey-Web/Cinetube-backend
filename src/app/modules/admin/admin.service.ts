import { prisma } from "../../../lib/prisma";

const buildMonthlySales = (sales: { amount: number; createdAt: Date }[]) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
      revenue: 0,
      salesCount: 0,
    };
  }).reverse();

  const monthMap = new Map(months.map((month) => [month.key, month]));

  sales.forEach((sale) => {
    const key = `${sale.createdAt.getUTCFullYear()}-${String(
      sale.createdAt.getUTCMonth() + 1,
    ).padStart(2, "0")}`;
    const bucket = monthMap.get(key);

    if (bucket) {
      bucket.revenue += sale.amount;
      bucket.salesCount += 1;
    }
  });

  return months;
};

const getAdminStats = async () => {
  const now = new Date();

  const [
    totalRevenue,
    totalUsers,
    premiumUsers,
    totalMovies,
    totalReviews,
    pendingReviews,
    publishedReviews,
    averageMovieRating,
    mostReviewed,
    recentSales,
  ] = await Promise.all([
    prisma.purchase.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.user.count({ where: { isBlocked: false } }),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        OR: [{ endDate: null }, { endDate: { gt: now } }],
        user: {
          isBlocked: false,
        },
      },
    }),
    prisma.movie.count(),
    prisma.review.count({ where: { parentId: null } }),
    prisma.review.count({ where: { parentId: null, isApproved: false } }),
    prisma.review.count({ where: { parentId: null, isApproved: true } }),
    prisma.movie.aggregate({
      _avg: { rating: true },
      where: { isPublished: true },
    }),
    prisma.movie.findMany({
      take: 5,
      include: {
        _count: { select: { reviews: true, purchases: true } },
      },
      orderBy: {
        reviews: { _count: "desc" },
      },
    }),
    prisma.purchase.findMany({
      where: { paymentStatus: "PAID" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    revenue: totalRevenue._sum.amount || 0,
    userCount: totalUsers,
    premiumUserCount: premiumUsers,
    movieCount: totalMovies,
    reviewCount: totalReviews,
    pendingReviewCount: pendingReviews,
    publishedReviewCount: publishedReviews,
    averageMovieRating: averageMovieRating._avg.rating || 0,
    trendingMovies: mostReviewed,
    monthlySales: buildMonthlySales(recentSales),
    recentSales: recentSales.slice(0, 5),
  };
};

export const AdminService = {
  getAdminStats,
};
