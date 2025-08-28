import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new ApiError(400, "Validation failed", errorMessages);
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .toLowerCase(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  body("fullName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Role must be student, teacher, or admin"),

  handleValidationErrors,
];

// User login validation
export const validateUserLogin = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  // Custom validation to ensure either username or email is provided
  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error("Either username or email is required");
    }
    return true;
  }),

  handleValidationErrors,
];

// Password change validation
export const validatePasswordChange = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  handleValidationErrors,
];

// Password reset validation
export const validatePasswordReset = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 32, max: 32 })
    .withMessage("Invalid reset token"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  handleValidationErrors,
];

// Forgot password validation
export const validateForgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  handleValidationErrors,
];

// Profile update validation
export const validateProfileUpdate = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),

  handleValidationErrors,
];

// User role update validation (admin only)
export const validateRoleUpdate = [
  body("role")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Role must be student, teacher, or admin"),

  handleValidationErrors,
];

// Query parameters validation for user listing
export const validateUserQuery = [
  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Role must be student, teacher, or admin"),

  body("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),

  handleValidationErrors,
];

// General input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize string fields in body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Remove potential XSS characters
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<[^>]*>/g, "")
          .trim();
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<[^>]*>/g, "")
          .trim();
      }
    });
  }

  // Sanitize route parameters
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (typeof req.params[key] === "string") {
        req.params[key] = req.params[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<[^>]*>/g, "")
          .trim();
      }
    });
  }

  next();
};

// Rate limiting validation (to be used with express-rate-limit)
export const createRateLimitOptions = (windowMs, maxRequests, message) => ({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    message: message || "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
