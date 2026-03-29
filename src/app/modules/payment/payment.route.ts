import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";


const paymentRouter = Router();

paymentRouter.post(
  "/create-intent",
  auth("USER"), 
  PaymentController.createPaymentIntent
);

export default paymentRouter;