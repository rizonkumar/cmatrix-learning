import { userService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadAvatarSingle } from "../services/fileUpload.service.js";

class UserController {
  // Get user profile
  getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await userService.getUserProfile(userId);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Profile retrieved successfully"));
  });

  // Update user profile
  updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fullName, avatar } = req.body;

    const result = await userService.updateUserProfile(userId, {
      fullName,
      avatar,
    });

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Upload user avatar
  uploadAvatar = [
    uploadAvatarSingle,
    asyncHandler(async (req, res) => {
      const userId = req.user._id;

      if (!req.file) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "No file uploaded"));
      }

      const avatarUrl = req.file.path;

      const result = await userService.updateUserProfile(userId, {
        avatar: avatarUrl,
      });

      res.status(200).json(
        new ApiResponse(
          200,
          {
            avatar: avatarUrl,
            user: result.user,
          },
          "Avatar uploaded successfully"
        )
      );
    }),
  ];

  // Change password
  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const result = await userService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Update user streak
  updateUserStreak = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await userService.updateUserStreak(userId);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Streak updated successfully"));
  });

  // Get user statistics
  getUserStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await userService.getUserStats(userId);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "User statistics retrieved successfully")
      );
  });

  // Delete user account
  deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const requesterId = req.user._id;

    const result = await userService.deleteUserAccount(userId, requesterId);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Admin: Get all users
  getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (search) filters.search = search;

    const result = await userService.getAllUsers(
      filters,
      parseInt(page),
      parseInt(limit)
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Users retrieved successfully"));
  });

  // Admin: Update user role
  updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    const adminId = req.user._id;

    const result = await userService.updateUserRole(userId, role, adminId);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Admin: Reset user streak
  resetUserStreak = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const adminId = req.user._id;

    const result = await userService.resetUserStreak(userId, adminId);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Admin: Delete user account
  adminDeleteUserAccount = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const adminId = req.user._id;

    const result = await userService.deleteUserAccount(userId, adminId);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  // Get user by ID (admin or self)
  getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    // Users can only view their own profile, admins can view any profile
    if (userId !== requesterId && requesterRole !== "admin") {
      return res.status(403).json(new ApiResponse(403, {}, "Access denied"));
    }

    const result = await userService.getUserProfile(userId);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "User profile retrieved successfully")
      );
  });
}

export const userController = new UserController();
