import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

router.use(sanitizeInput);

router.use(verifyJWT);

router
  .route("/courses/:courseId")
  .post(wishlistController.addToWishlist)
  .delete(wishlistController.removeFromWishlist);

router
  .route("/courses/:courseId/toggle")
  .post(wishlistController.toggleWishlist);

router
  .route("/courses/:courseId/status")
  .get(wishlistController.checkWishlistStatus);

// Get user's wishlist
router.route("/").get(wishlistController.getUserWishlist);

export default router;
