import { Review } from "../models/review.model.js";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { ApiError } from "../utils/ApiError.js";

class ReviewService {
  async createReview(studentId, courseId, reviewData) {
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      throw new ApiError(404, "Course not found or not available");
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      isCompleted: true,
    });

    if (!enrollment) {
      throw new ApiError(403, "You must complete the course to leave a review");
    }

    // Check if student already reviewed this course
    const existingReview = await Review.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingReview) {
      throw new ApiError(409, "You have already reviewed this course");
    }

    // Create review
    const review = await Review.create({
      ...reviewData,
      student: studentId,
      course: courseId,
      isVerified: true, // Since they completed the course
    });

    // Update course rating and review count
    await this.updateCourseRating(courseId);

    return await Review.findById(review._id)
      .populate("student", "username fullName avatar")
      .populate("course", "title");
  }

  async getCourseReviews(courseId, page = 1, limit = 10, sortBy = "newest") {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortOption = { createdAt: -1 }; // newest first
    if (sortBy === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sortBy === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sortBy === "lowest") {
      sortOption = { rating: 1, createdAt: -1 };
    } else if (sortBy === "helpful") {
      sortOption = { helpfulCount: -1, createdAt: -1 };
    }

    const reviews = await Review.find({
      course: courseId,
      isApproved: true,
    })
      .populate("student", "username fullName avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({
      course: courseId,
      isApproved: true,
    });

    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    return {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async getReviewById(reviewId) {
    const review = await Review.findById(reviewId)
      .populate("student", "username fullName avatar")
      .populate("course", "title");

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    return review;
  }

  async updateReview(reviewId, studentId, updateData) {
    const review = await Review.findOne({
      _id: reviewId,
      student: studentId,
    });

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Update review
    Object.assign(review, updateData);
    await review.save();

    // Update course rating
    await this.updateCourseRating(review.course);

    return await Review.findById(reviewId)
      .populate("student", "username fullName avatar")
      .populate("course", "title");
  }

  async deleteReview(reviewId, studentId) {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      student: studentId,
    });

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Update course rating
    await this.updateCourseRating(review.course);

    return review;
  }

  async markReviewHelpful(reviewId, userId) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Remove from helpful if already marked
    const helpfulIndex = review.helpful.indexOf(userId);
    if (helpfulIndex > -1) {
      review.helpful.splice(helpfulIndex, 1);
    } else {
      review.helpful.push(userId);
    }

    await review.save();
    return review;
  }

  async reportReview(reviewId, userId, reason) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Check if user already reported
    if (review.reported.includes(userId)) {
      throw new ApiError(400, "You have already reported this review");
    }

    review.reported.push(userId);
    await review.save();

    // If too many reports, hide the review
    if (review.reported.length >= 3) {
      review.isApproved = false;
      await review.save();
      await this.updateCourseRating(review.course);
    }

    return review;
  }

  async getMyReviews(studentId, page = 1, limit = 10) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ student: studentId })
      .populate("course", "title category thumbnailUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ student: studentId });
    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    return {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async updateCourseRating(courseId) {
    const ratingData = await Review.getAverageRating(courseId);

    await Course.findByIdAndUpdate(courseId, {
      rating: ratingData.averageRating,
      reviewCount: ratingData.totalReviews,
    });

    return ratingData;
  }

  async getReviewStats(courseId) {
    const ratingData = await Review.getAverageRating(courseId);

    // Get additional stats
    const totalReviews = await Review.countDocuments({
      course: courseId,
      isApproved: true,
    });

    const verifiedReviews = await Review.countDocuments({
      course: courseId,
      isApproved: true,
      isVerified: true,
    });

    return {
      ...ratingData,
      verifiedReviews,
      verificationRate:
        totalReviews > 0
          ? Math.round((verifiedReviews / totalReviews) * 100)
          : 0,
    };
  }

  // Admin methods
  async getAllReviews(filters = {}, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (filters.isApproved !== undefined) {
      query.isApproved = filters.isApproved;
    }
    if (filters.courseId) {
      query.course = filters.courseId;
    }
    if (filters.rating) {
      query.rating = filters.rating;
    }

    const reviews = await Review.find(query)
      .populate("student", "username fullName email")
      .populate("course", "title category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    return {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async approveReview(reviewId, adminId) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    review.isApproved = true;
    await review.save();

    // Update course rating
    await this.updateCourseRating(review.course);

    return review;
  }

  async rejectReview(reviewId, adminId) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    review.isApproved = false;
    await review.save();

    // Update course rating
    await this.updateCourseRating(review.course);

    return review;
  }
}

export const reviewService = new ReviewService();
