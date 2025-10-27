import { authService } from "../services/auth.service.js";
import { emailService } from "../services/email.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Invalid email address"),
  fullName: z.string()
    .min(1, "Full name is required")
    .max(50, "Full name must not exceed 50 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  role: z.enum(["user", "admin"]).optional().default("user"),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(1, "Password is required"),
}).refine((data) => data.username || data.email, {
  message: "Either username or email must be provided",
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

const validateRequest = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json(
          new ApiResponse(400, null, "Validation failed", errorMessages)
        );
      }
      next(error);
    }
  });
};

class AuthController {
  register = [
    validateRequest(registerSchema),
    asyncHandler(async (req, res) => {
      const { username, email, fullName, password, role, avatar } = req.body;

      const result = await authService.register({
        username,
        email,
        fullName,
        password,
        role,
        avatar,
      });

      try {
        await emailService.sendWelcomeEmail(email, username, fullName);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      res
        .status(201)
        .json(new ApiResponse(201, result, "User registered successfully"));
    })
  ];

  login = [
    validateRequest(loginSchema),
    asyncHandler(async (req, res) => {
      const { username, email, password } = req.body;

      const result = await authService.login({
        username,
        email,
        password,
      });

      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(200).json(new ApiResponse(200, result, "Login successful"));
    })
  ];

  logout = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await authService.logout(userId);

    this.clearAuthCookies(res);

    res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Refresh token not provided"));
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: tokens.accessToken },
          "Token refreshed successfully"
        )
      );
  });

  // Forgot password
  forgotPassword = [
    validateRequest(forgotPasswordSchema),
    asyncHandler(async (req, res) => {
      const { email } = req.body;

      const result = await authService.forgotPassword(email);

      res.status(200).json(new ApiResponse(200, result, result.message));
    })
  ];

  // Reset password
  resetPassword = [
    validateRequest(resetPasswordSchema),
    asyncHandler(async (req, res) => {
      const { token, newPassword } = req.body;

      const result = await authService.resetPassword(token, newPassword);

      res.status(200).json(new ApiResponse(200, result, result.message));
    })
  ];

  changePassword = [
    validateRequest(changePasswordSchema),
    asyncHandler(async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user._id;

      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      res.status(200).json(new ApiResponse(200, result, result.message));
    })
  ];

  getCurrentUser = asyncHandler(async (req, res) => {
    const user = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      avatar: req.user.avatar,
      currentStreak: req.user.currentStreak,
      longestStreak: req.user.longestStreak,
      lastActivityDate: req.user.lastActivityDate,
    };

    res
      .status(200)
      .json(new ApiResponse(200, { user }, "User info retrieved successfully"));
  });

  // Verify token (for frontend to check if user is authenticated)
  verifyToken = asyncHandler(async (req, res) => {
    res
      .status(200)
      .json(new ApiResponse(200, { authenticated: true }, "Token is valid"));
  });

  setAuthCookies(res, accessToken, refreshToken) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
  }

  clearAuthCookies(res) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
  }
}

export const authController = new AuthController();