import { Request, Response } from "express";
import Stripe from "stripe";
import { PaymentService } from "./payment.service";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = PaymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid webhook signature";
    console.error(`Webhook Signature Verification Failed: ${message}`);
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await PaymentService.recordCompletedCheckoutSession(session);
  }

  res.json({ received: true });
};
