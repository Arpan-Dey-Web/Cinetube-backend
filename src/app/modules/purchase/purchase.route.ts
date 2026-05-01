import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { PurchaseValidation } from "./purchase.validation";

const purchaseRouter = Router();

// Get user's library
purchaseRouter.get(
    "/my-purchases", 
    auth("USER", "ADMIN"), 
    PurchaseController.getMyPurchases
  );
  
  // Verify access to a specific movie
  purchaseRouter.get(
    "/check-access/:movieId",
    auth("USER", "ADMIN"),
    PurchaseController.verifyAccess
  );
  
  // Create a purchase record (Secure this! Usually called by Webhook or Admin)
  purchaseRouter.post(
    "/create",
    auth("USER", "ADMIN"),
    validateRequest(PurchaseValidation.createPurchaseSchema),
    PurchaseController.createPurchase
  );

export default purchaseRouter;
