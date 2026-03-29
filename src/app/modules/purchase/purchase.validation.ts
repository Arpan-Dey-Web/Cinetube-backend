import { z } from "zod";

const createPurchaseSchema = z.object({
  body: z.object({
    movieId: z.string({ message: "Movie ID is required" }),
    transactionId: z.string({ message: "Transaction ID is required" }),
    amount: z.number().positive("Amount must be greater than 0"),
  }),
});

export const PurchaseValidation = {
  createPurchaseSchema,
};