import { Wishlist } from "../models/wishlist.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";

class WishlistService {
  async addToWishlist(userId, courseId) {
    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      throw new ApiError(404, "Course not found or not available");
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: userId,
      course: courseId,
    });

    if (existingWishlist) {
      throw new ApiError(409, "Course is already in wishlist");
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: userId,
      course: courseId,
    });

    return await Wishlist.findById(wishlistItem._id)
      .populate("course", "title thumbnailUrl price")
      .populate("user", "fullName");
  }

  async removeFromWishlist(userId, courseId) {
    const wishlistItem = await Wishlist.findOneAndDelete({
      user: userId,
      course: courseId,
    });

    if (!wishlistItem) {
      throw new ApiError(404, "Wishlist item not found");
    }

    return wishlistItem;
  }

  async getUserWishlist(userId, page = 1, limit = 10) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const wishlistItems = await Wishlist.find({ user: userId })
      .populate({
        path: "course",
        select:
          "title description thumbnailUrl price difficulty category instructor",
        populate: {
          path: "instructor",
          select: "fullName avatar",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Wishlist.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return {
      wishlist: wishlistItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async checkWishlistStatus(userId, courseId) {
    const wishlistItem = await Wishlist.findOne({
      user: userId,
      course: courseId,
    });

    return !!wishlistItem;
  }

  async toggleWishlist(userId, courseId) {
    const existingItem = await Wishlist.findOne({
      user: userId,
      course: courseId,
    });

    if (existingItem) {
      // Remove from wishlist
      await this.removeFromWishlist(userId, courseId);
      return { action: "removed", isWishlisted: false };
    } else {
      // Add to wishlist
      await this.addToWishlist(userId, courseId);
      return { action: "added", isWishlisted: true };
    }
  }
}

export const wishlistService = new WishlistService();
