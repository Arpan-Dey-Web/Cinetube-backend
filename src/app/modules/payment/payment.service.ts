import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

const createPaymentIntentInDB = async (userId: string, movieId: string) => {
  // 1. Fetch movie from DB to ensure price integrity
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) throw new Error("Movie not found");
  if (movie.status !== "PREMIUM") throw new Error("This movie is already free");

  // 2. Create Intent (Amount in cents: $10.00 = 1000)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(movie.price * 100),
    currency: "usd",
    metadata: { userId, movieId }, // Passed back to us in Webhook
    payment_method_types: ["card"],
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

export const PaymentService = {
  createPaymentIntentInDB,
  stripe, // Export instance for the webhook to use
};