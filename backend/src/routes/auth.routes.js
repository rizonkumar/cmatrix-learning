import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    validateUserRegistration,
    validateUserLogin,
    validatePasswordChange,
    validatePasswordReset,
    validateForgotPassword,
    sanitizeInput
} from '../middlewares/validation.middleware.js';

const router = Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.route('/register').post(validateUserRegistration, authController.register);
router.route('/login').post(validateUserLogin, authController.login);
router.route('/forgot-password').post(validateForgotPassword, authController.forgotPassword);
router.route('/reset-password').post(validatePasswordReset, authController.resetPassword);

// Protected routes (require authentication)
router.route('/logout').post(verifyJWT, authController.logout);
router.route('/refresh-token').post(authController.refreshToken);
router.route('/verify-token').get(verifyJWT, authController.verifyToken);
router.route('/me').get(verifyJWT, authController.getCurrentUser);
router.route('/change-password').post(verifyJWT, validatePasswordChange, authController.changePassword);

export default router;
