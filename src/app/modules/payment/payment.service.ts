import Stripe from "stripe";
import AppError from "../../errorHelpers/AppError";
import { SubscriptionStatus } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import { hasActiveSubscription } from "../../../utils/access";
import { PurchaseService } from "../purchase/purchase.service";

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  console.error("❌ STRIPE_SECRET_KEY is undefined. Check your .env file.");
}

// Only initialize once using the verified apiKey
const stripe = new Stripe(apiKey as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

type PremiumPlanCode = "MONTHLY" | "ANNUAL";

type PremiumPlan = {
  code: PremiumPlanCode;
  name: string;
  unitAmount: number;
  months: number;
};

const PREMIUM_PLANS: Record<PremiumPlanCode, PremiumPlan> = {
  MONTHLY: {
    code: "MONTHLY",
    name: "Monthly Premium",
    unitAmount: 1400,
    months: 1,
  },
  ANNUAL: {
    code: "ANNUAL",
    name: "Annual Premium",
    unitAmount: 12900,
    months: 12,
  },
};

const PREMIUM_PLAN_LIST = Object.values(PREMIUM_PLANS);

const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error("FRONTEND_URL is not configured");
  }

  return frontendUrl;
};

const parsePriceToCents = (price: string | number) => {
  const numericPrice =
    typeof price === "number"
      ? price
      : Number(price.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numericPrice)) {
    throw new AppError(400, "Premium plan price is invalid.");
  }

  if (numericPrice <= 0) {
    throw new AppError(400, "Choose a premium plan to continue.");
  }

  return Math.round(numericPrice * 100);
};

const getPremiumPlanByPrice = (price: string | number) => {
  const unitAmount = parsePriceToCents(price);
  const plan = PREMIUM_PLAN_LIST.find((item) => item.unitAmount === unitAmount);

  if (!plan) {
    throw new AppError(400, "Invalid premium plan price.");
  }

  return plan;
};

const getPremiumPlanByCode = (code?: string) => {
  if (code === "MONTHLY" || code === "ANNUAL") {
    return PREMIUM_PLANS[code];
  }

  throw new Error("Premium checkout metadata is incomplete");
};

const addMonths = (date: Date, months: number) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

const getStripeResourceId = (value: string | { id?: string } | null) => {
  if (typeof value === "string") {
    return value;
  }

  return value?.id ?? null;
};

const createPaymentIntentInDB = async (userId: string, movieId: string) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) throw new Error("Movie not found");


  // Stripe expects integers in cents (e.g., $9.99 -> 999)
  const amountInCents = Math.round(movie.price * 100);


  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: {
      userId: userId.toString(),
      movieId: movieId.toString()
    },
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};


const createCheckoutSession = async (userId: string, movieId: string) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) throw new Error("Movie not found");

  const frontendUrl = getFrontendUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: movie.title,
            description: "Premium Movie Access",
          },
          unit_amount: Math.round(movie.price * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${frontendUrl}/browse/${movieId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/browse/${movieId}?payment=cancel`,

    metadata: {
      checkoutType: "movie",
      userId,
      movieId,
    },
  });

  return { url: session.url };
};

const createPremiumCheckoutSession = async (
  userId: string,
  price: string | number,
) => {
  const plan = getPremiumPlanByPrice(price);
  const frontendUrl = getFrontendUrl();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscription: {
        select: {
          status: true,
          endDate: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (hasActiveSubscription(user.subscription)) {
    throw new AppError(400, "You already have Premium access to all content!");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: userId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Cinetube ${plan.name}`,
            description: "All premium movie access",
          },
          unit_amount: plan.unitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${frontendUrl}/pricing?premium=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/pricing?premium=cancel`,
    metadata: {
      checkoutType: "premium",
      userId,
      plan: plan.code,
    },
  });

  return { url: session.url };
};

const recordCompletedMovieCheckoutSession = async (
  session: Stripe.Checkout.Session
) => {
  const metadata = session.metadata ?? {};
  const userId = metadata.userId;
  const movieId = metadata.movieId;

  if (!userId || !movieId) {
    throw new Error("Checkout session metadata is incomplete");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Checkout session is not paid yet");
  }

  const amount = (session.amount_total ?? 0) / 100;

  const purchase = await PurchaseService.createPurchaseInDB(
    userId,
    movieId,
    amount,
    session.id
  );

  return {
    checkoutType: "movie" as const,
    purchase,
    movieId,
  };
};

const recordCompletedPremiumCheckoutSession = async (
  session: Stripe.Checkout.Session
) => {
  const metadata = session.metadata ?? {};
  const userId = metadata.userId;
  const plan = getPremiumPlanByCode(metadata.plan);

  if (!userId) {
    throw new Error("Premium checkout session metadata is incomplete");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Checkout session is not paid yet");
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (existingSubscription?.stripeSubscriptionId === session.id) {
    return {
      checkoutType: "premium" as const,
      subscription: existingSubscription,
    };
  }

  const now = new Date();
  const baseDate =
    existingSubscription?.status === SubscriptionStatus.ACTIVE &&
    existingSubscription.endDate &&
    existingSubscription.endDate > now
      ? existingSubscription.endDate
      : now;

  const subscriptionData = {
    status: SubscriptionStatus.ACTIVE,
    plan: plan.code,
    startDate: now,
    endDate: addMonths(baseDate, plan.months),
    stripeCustomerId: getStripeResourceId(session.customer),
    stripeSubscriptionId: session.id,
  };

  const subscription = existingSubscription
    ? await prisma.subscription.update({
        where: { userId },
        data: subscriptionData,
      })
    : await prisma.subscription.create({
        data: {
          userId,
          ...subscriptionData,
        },
      });

  return {
    checkoutType: "premium" as const,
    subscription,
  };
};

const recordCompletedCheckoutSession = async (
  session: Stripe.Checkout.Session
) => {
  if (session.metadata?.checkoutType === "premium") {
    return recordCompletedPremiumCheckoutSession(session);
  }

  return recordCompletedMovieCheckoutSession(session);
};

const confirmCheckoutSession = async (userId: string, sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Checkout session not found");
  }

  if (session.metadata?.userId !== userId) {
    throw new Error("You are not allowed to confirm this checkout session");
  }

  return recordCompletedCheckoutSession(session);
};

export const PaymentService = {
  createPaymentIntentInDB,
  createCheckoutSession,
  createPremiumCheckoutSession,
  recordCompletedCheckoutSession,
  confirmCheckoutSession,
  stripe,
};
