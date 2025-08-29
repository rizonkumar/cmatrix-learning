import { reviewService } from "../services/review.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ReviewController {
  // Create a review
  createReview = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;
    const reviewData = req.body;

    const review = await reviewService.createReview(
      studentId,
      courseId,
      reviewData
    );

    res
      .status(201)
      .json(new ApiResponse(201, { review }, "Review created successfully"));
  });

  // Get reviews for a course
  getCourseReviews = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { page = 1, limit = 10, sortBy = "newest" } = req.query;

    const result = await reviewService.getCourseReviews(
      courseId,
      page,
      limit,
      sortBy
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Course reviews retrieved successfully")
      );
  });

  // Get review by ID
  getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await reviewService.getReviewById(reviewId);

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review retrieved successfully"));
  });

  // Update review
  updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const studentId = req.user._id;
    const updateData = req.body;

    const review = await reviewService.updateReview(
      reviewId,
      studentId,
      updateData
    );

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review updated successfully"));
  });

  // Delete review
  deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const studentId = req.user._id;

    await reviewService.deleteReview(reviewId, studentId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Review deleted successfully"));
  });

  // Mark review as helpful
  markHelpful = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await reviewService.markReviewHelpful(reviewId, userId);

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review marked as helpful"));
  });

  // Report review
  reportReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const review = await reviewService.reportReview(reviewId, userId, reason);

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review reported successfully"));
  });

  // Get user's reviews
  getMyReviews = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const result = await reviewService.getMyReviews(studentId, page, limit);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Your reviews retrieved successfully")
      );
  });

  // Get review statistics for a course
  getReviewStats = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const stats = await reviewService.getReviewStats(courseId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stats },
          "Review statistics retrieved successfully"
        )
      );
  });

  // Admin: Get all reviews
  getAllReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, isApproved, courseId, rating } = req.query;

    const filters = {};
    if (isApproved !== undefined) filters.isApproved = isApproved === "true";
    if (courseId) filters.courseId = courseId;
    if (rating) filters.rating = parseInt(rating);

    const result = await reviewService.getAllReviews(filters, page, limit);

    res
      .status(200)
      .json(new ApiResponse(200, result, "All reviews retrieved successfully"));
  });

  // Admin: Approve review
  approveReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const adminId = req.user._id;

    const review = await reviewService.approveReview(reviewId, adminId);

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review approved successfully"));
  });

  // Admin: Reject review
  rejectReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const adminId = req.user._id;

    const review = await reviewService.rejectReview(reviewId, adminId);

    res
      .status(200)
      .json(new ApiResponse(200, { review }, "Review rejected successfully"));
  });
}

export const reviewController = new ReviewController();
