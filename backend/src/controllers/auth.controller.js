import { authService } from "../services/auth.service.js";
import { emailService } from "../services/email.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
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

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    res
      .status(201)
      .json(new ApiResponse(201, result, "User registered successfully"));
  });

  login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const result = await authService.login({
      username,
      email,
      password,
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, result, "Login successful"));
  });

  logout = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await authService.logout(userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

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
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Reset password
  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Change password (authenticated user)
  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const result = await authService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Get current user info
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
}

export const authController = new AuthController();
