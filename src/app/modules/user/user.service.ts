import { prisma } from "../../../lib/prisma";
import { getContentStatus } from "../../../utils/access";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  image: true,
  phone: true,
  address: true,
  createdAt: true,
  updatedAt: true,
  subscription: {
    select: {
      status: true,
      endDate: true,
    },
  },
} as const;

const withContentStatus = <
  T extends {
    subscription: {
      status: "ACTIVE" | "EXPIRED" | "CANCELED" | "PAST_DUE";
      endDate: Date | null;
    } | null;
  },
>(
  user: T,
) => {
  const { subscription, ...userFields } = user;

  return {
    ...userFields,
    contentStatus: getContentStatus(subscription),
  };
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userProfileSelect,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return withContentStatus(user);
};

const updateMyProfileInDB = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
  },
) => {
  const updateData: {
    name?: string;
    phone?: string;
    address?: string;
    image?: string | null;
  } = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  if (payload.image !== undefined) {
    updateData.image = payload.image || null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: userProfileSelect,
  });

  return withContentStatus(updatedUser);
};

const getUserStatsFromDB = async (userId: string) => {
  const [
    totalReviews,
    approvedReviews,
    pendingReviews,
    totalComments,
    watchlistCount,
    purchaseCount,
    averageRating,
    recentReviews,
  ] = await Promise.all([
    prisma.review.count({
      where: { userId, parentId: null },
    }),
    prisma.review.count({
      where: { userId, parentId: null, isApproved: true },
    }),
    prisma.review.count({
      where: { userId, parentId: null, isApproved: false },
    }),
    prisma.review.count({
      where: { userId, parentId: { not: null } },
    }),
    prisma.watchlist.count({
      where: { userId },
    }),
    prisma.purchase.count({
      where: { userId, paymentStatus: "PAID" },
    }),
    prisma.review.aggregate({
      where: { userId, parentId: null, isApproved: true },
      _avg: { rating: true },
    }),
    prisma.review.findMany({
      where: { userId, parentId: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
          },
        },
      },
    }),
  ]);

  return {
    totalReviews,
    approvedReviews,
    pendingReviews,
    totalComments,
    watchlistCount,
    purchaseCount,
    averageRating: averageRating._avg.rating || 0,
    recentReviews,
  };
};

export const UserService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
  getUserStatsFromDB,
};
