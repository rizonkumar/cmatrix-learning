import { wishlistService } from "../services/wishlist.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class WishlistController {
  addToWishlist = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const wishlistItem = await wishlistService.addToWishlist(userId, courseId);

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { wishlistItem },
          "Course added to wishlist successfully"
        )
      );
  });

  removeFromWishlist = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    await wishlistService.removeFromWishlist(userId, courseId);

    res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Course removed from wishlist successfully")
      );
  });

  // Toggle wishlist status (add/remove)
  toggleWishlist = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const result = await wishlistService.toggleWishlist(userId, courseId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isWishlisted: result.isWishlisted },
          `Course ${result.action} ${
            result.action === "added" ? "to" : "from"
          } wishlist successfully`
        )
      );
  });

  // Get user's wishlist
  getUserWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const result = await wishlistService.getUserWishlist(userId, page, limit);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Wishlist retrieved successfully"));
  });

  // Check if course is in user's wishlist
  checkWishlistStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const isWishlisted = await wishlistService.checkWishlistStatus(
      userId,
      courseId
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isWishlisted },
          "Wishlist status checked successfully"
        )
      );
  });
}

export const wishlistController = new WishlistController();
