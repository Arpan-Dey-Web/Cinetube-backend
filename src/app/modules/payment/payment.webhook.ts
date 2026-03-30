import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { PurchaseService } from "../purchase/purchase.service";
import { prisma } from "../../../lib/prisma";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    event = PaymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the successful payment event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    const { userId, movieId } = paymentIntent.metadata;

    if (!userId || !movieId) {
      console.error(
        "Webhook received but metadata (userId/movieId) is missing.",
      );
      return res.json({ received: true });
    }

    try {
      // 1. Check if this transaction has already been processed (Idempotency)
      const existingPurchase = await prisma.purchase.findUnique({
        where: { transactionId: paymentIntent.id },
      });

      if (!existingPurchase) {
        // 2. Unlock the movie
        await PurchaseService.createPurchaseInDB(
          userId,
          movieId,
          paymentIntent.amount_received / 100, // Stripe sends cents, we store dollars
          paymentIntent.id,
        );
        console.log(
          `Purchase successful for User: ${userId}, Movie: ${movieId}`,
        );
      } else {
        console.log(
          `Purchase already processed for Transaction: ${paymentIntent.id}`,
        );
      }
    } catch (dbError) {
      console.error("Database Error during webhook processing:", dbError);
      // We return 500 so Stripe knows to retry later
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  res.json({ received: true });
};
