import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  console.error("❌ STRIPE_SECRET_KEY is undefined. Check your .env file.");
}

// Only initialize once using the verified apiKey
const stripe = new Stripe(apiKey as string, {
  apiVersion: "2025-01-27.acacia" as any, 
});

const createPaymentIntentInDB = async (userId: string, movieId: string) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) throw new Error("Movie not found");
  
  // Logic: Ensure we don't charge for free content
  if (movie.status === "FREE") {
    throw new Error("This movie is free and does not require payment.");
  }

  // Stripe expects integers in cents (e.g., $9.99 -> 999)
  const amountInCents = Math.round(movie.price * 100);


  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { 
      userId: userId.toString(), // Ensure it's a string
      movieId: movieId.toString() 
    },
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

export const PaymentService = {
  createPaymentIntentInDB,
  stripe, 
};