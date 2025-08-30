import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class AuthService {
  generateAccessToken(user) {
    return user.generateAccessToken();
  }

  generateRefreshToken(user) {
    return user.generateRefreshToken();
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateResetPasswordToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Register new user
  async register(userData) {
    const {
      username,
      email,
      fullName,
      password,
      role = "student",
      avatar,
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ApiError(409, "Username already exists");
      }
      if (existingUser.email === email) {
        throw new ApiError(409, "Email already exists");
      }
    }

    // Create user
    const userCreateData = {
      username,
      email,
      fullName,
      password,
      role,
    };

    if (avatar) {
      userCreateData.avatar = avatar;
    }

    const user = await User.create(userCreateData);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
      accessToken,
      refreshToken,
    };
  }

  // Login user
  async login(credentials) {
    const { username, email, password } = credentials;

    // Find user
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Update streak if it's a new day
    await this.updateUserStreak(user);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
      accessToken,
      refreshToken,
    };
  }

  // Logout user
  async logout(userId) {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }

  // Forgot password - generate reset token
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message:
          "If an account with this email exists, a reset link has been sent.",
      };
    }

    // Generate reset token
    const resetToken = this.generateResetPasswordToken();
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save reset token (you might want to hash this in production)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send email (we'll implement this)
    await this.sendResetPasswordEmail(user.email, resetToken);

    return {
      success: true,
      message: "Password reset link sent to your email.",
    };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return { success: true, message: "Password reset successfully" };
  }

  // Update user streak
  async updateUserStreak(user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActivityDate
      ? new Date(user.lastActivityDate)
      : null;
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    if (!lastActivity || lastActivity.getTime() !== today.getTime()) {
      if (
        lastActivity &&
        today.getTime() - lastActivity.getTime() === 86400000
      ) {
        // Consecutive day
        user.currentStreak += 1;
      } else if (
        !lastActivity ||
        today.getTime() - lastActivity.getTime() > 86400000
      ) {
        // Reset streak
        user.currentStreak = 1;
      }

      // Update longest streak
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      user.lastActivityDate = today;
      await user.save();
    }
  }

  // Send reset password email (placeholder - implement with nodemailer)
  async sendResetPasswordEmail(email, token) {
    // This will be implemented when we create the email service
    console.log(
      `Reset password email would be sent to ${email} with token: ${token}`
    );
    // TODO: Implement actual email sending
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify old password
    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordValid) {
      throw new ApiError(400, "Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { success: true, message: "Password changed successfully" };
  }
}

export const authService = new AuthService();
