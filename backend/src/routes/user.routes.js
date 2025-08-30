import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  validateProfileUpdate,
  validatePasswordChange,
  validateRoleUpdate,
  sanitizeInput,
} from "../middlewares/validation.middleware.js";

const router = Router();

router.use(sanitizeInput);

router.use(verifyJWT);

// User profile management
router
  .route("/profile")
  .get(userController.getUserProfile)
  .put(validateProfileUpdate, userController.updateUserProfile);

router
  .route("/change-password")
  .post(validatePasswordChange, userController.changePassword);
router.route("/stats").get(userController.getUserStats);
router.route("/streak").post(userController.updateUserStreak);
router.route("/delete-account").delete(userController.deleteUserAccount);

// Admin routes
router.route("/all").get(authorizeRoles("admin"), userController.getAllUsers);

router
  .route("/:userId")
  .get(userController.getUserById)
  .delete(authorizeRoles("admin"), userController.adminDeleteUserAccount);

router
  .route("/:userId/role")
  .put(
    authorizeRoles("admin"),
    validateRoleUpdate,
    userController.updateUserRole
  );

router
  .route("/:userId/streak/reset")
  .post(authorizeRoles("admin"), userController.resetUserStreak);

export default router;
