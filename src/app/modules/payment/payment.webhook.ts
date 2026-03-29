import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { PurchaseService } from "../purchase/purchase.service";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    // We use req.body (which must be RAW) to verify the signature
    event = PaymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const session = event.data.object as any;
    const { userId, movieId } = session.metadata;

    // Unlock the movie in your database
    await PurchaseService.createPurchaseInDB(
      userId,
      movieId,
      session.amount_received / 100,
      session.id
    );
  }

  res.json({ received: true });
};