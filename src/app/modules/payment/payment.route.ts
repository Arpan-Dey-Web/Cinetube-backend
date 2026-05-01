import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentValidation } from "./payment.validation";

const paymentRouter = Router();

paymentRouter.post(
  "/create-intent",
  auth("USER"), 
  validateRequest(PaymentValidation.createPaymentIntentSchema),
  PaymentController.createPaymentIntent
);

paymentRouter.post(
  "/checkout",
  auth("USER"),
  PaymentController.createCheckoutSession
);

paymentRouter.post(
  "/premium-checkout",
  auth("USER"),
  validateRequest(PaymentValidation.createPremiumCheckoutSessionSchema),
  PaymentController.createPremiumCheckoutSession
);

paymentRouter.post(
  "/confirm-checkout",
  auth("USER"),
  validateRequest(PaymentValidation.confirmCheckoutSessionSchema),
  PaymentController.confirmCheckoutSession
);

export default paymentRouter;
