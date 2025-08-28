import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

class UserService {
    // Get user profile
    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

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
                lastActivityDate: user.lastActivityDate,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
    }

    // Update user profile
    async updateUserProfile(userId, updateData) {
        const { fullName, avatar } = updateData;

        // Validate input
        if (!fullName || fullName.trim().length < 2) {
            throw new ApiError(400, 'Full name must be at least 2 characters long');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                fullName: fullName.trim(),
                ...(avatar && { avatar })
            },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                avatar: user.avatar,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak
            },
            message: 'Profile updated successfully'
        };
    }

    // Change password
    async changePassword(userId, oldPassword, newPassword) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Verify old password
        const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
        if (!isOldPasswordValid) {
            throw new ApiError(400, 'Current password is incorrect');
        }

        // Validate new password
        if (newPassword.length < 6) {
            throw new ApiError(400, 'New password must be at least 6 characters long');
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return { success: true, message: 'Password changed successfully' };
    }

    // Update user streak
    async updateUserStreak(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
        if (lastActivity) {
            lastActivity.setHours(0, 0, 0, 0);
        }

        let streakUpdated = false;

        if (!lastActivity || lastActivity.getTime() !== today.getTime()) {
            if (lastActivity && (today.getTime() - lastActivity.getTime()) === 86400000) {
                // Consecutive day - increment streak
                user.currentStreak += 1;
                streakUpdated = true;
            } else if (!lastActivity || (today.getTime() - lastActivity.getTime()) > 86400000) {
                // First activity or gap in activity - reset to 1
                user.currentStreak = 1;
                streakUpdated = true;
            }

            // Update longest streak if current is higher
            if (user.currentStreak > user.longestStreak) {
                user.longestStreak = user.currentStreak;
            }

            user.lastActivityDate = today;
            await user.save();
        }

        return {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            streakUpdated,
            lastActivityDate: user.lastActivityDate
        };
    }

    // Reset user streak (admin function)
    async resetUserStreak(userId, adminId) {
        // Check if requester is admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new ApiError(403, 'Only admins can reset user streaks');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        user.currentStreak = 0;
        user.lastActivityDate = null;
        await user.save();

        return {
            success: true,
            message: 'User streak reset successfully',
            userId: user._id,
            currentStreak: user.currentStreak
        };
    }

    // Get user statistics
    async getUserStats(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Get additional stats (these would be calculated based on enrollments, courses, etc.)
        const stats = {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastActivityDate: user.lastActivityDate,
            accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
            totalCoursesEnrolled: 0, // Would be calculated from enrollment model
            totalLessonsCompleted: 0, // Would be calculated from enrollment progress
            totalStudyTime: 0, // Would be calculated from lesson completions
            achievements: [] // Would be based on streaks, completions, etc.
        };

        // Add achievements based on streaks
        if (stats.currentStreak >= 7) {
            stats.achievements.push('Week Warrior');
        }
        if (stats.currentStreak >= 30) {
            stats.achievements.push('Monthly Master');
        }
        if (stats.longestStreak >= 100) {
            stats.achievements.push('Century Champion');
        }
        if (stats.accountAge >= 365) {
            stats.achievements.push('Yearly Scholar');
        }

        return {
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            },
            stats
        };
    }

    // Delete user account
    async deleteUserAccount(userId, requesterId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Check if user can delete this account
        const requester = await User.findById(requesterId);
        if (!requester) {
            throw new ApiError(404, 'Requester not found');
        }

        // Users can only delete their own account, admins can delete any account
        if (userId !== requesterId && requester.role !== 'admin') {
            throw new ApiError(403, 'You can only delete your own account');
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        return {
            success: true,
            message: 'User account deleted successfully'
        };
    }

    // Get all users (admin only)
    async getAllUsers(filters = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const query = {};

        // Apply filters
        if (filters.role) {
            query.role = filters.role;
        }
        if (filters.search) {
            query.$or = [
                { username: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { fullName: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    // Update user role (admin only)
    async updateUserRole(userId, newRole, adminId) {
        // Check if requester is admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new ApiError(403, 'Only admins can update user roles');
        }

        // Validate role
        const validRoles = ['student', 'teacher', 'admin'];
        if (!validRoles.includes(newRole)) {
            throw new ApiError(400, 'Invalid role specified');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            message: 'User role updated successfully'
        };
    }
}

export const userService = new UserService();
