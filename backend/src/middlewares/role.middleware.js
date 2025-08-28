import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authorizeRoles = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Role: ${req.user.role} is not allowed to access this resource`);
        }

        next();
    });
};

// Specific role middleware functions
export const requireTeacher = authorizeRoles('teacher', 'admin');
export const requireAdmin = authorizeRoles('admin');
export const requireStudent = authorizeRoles('student', 'teacher', 'admin');
