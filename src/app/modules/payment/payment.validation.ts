import { z } from "zod";

const createPaymentIntentSchema = z.object({
  body: z.object({
    movieId: z.string({ message: "Movie ID is required" }),
  }),
});

const createPremiumCheckoutSessionSchema = z.object({
  body: z.object({
    price: z.union([z.string(), z.number()]),
  }),
});

const confirmCheckoutSessionSchema = z.object({
  body: z.object({
    sessionId: z.string({ message: "Session ID is required" }),
  }),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
  createPremiumCheckoutSessionSchema,
  confirmCheckoutSessionSchema,
};
