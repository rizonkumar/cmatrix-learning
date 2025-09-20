import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { reviewService } from "../services/review.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class CourseController {
  getAllCourses = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 12,
      category,
      subject,
      difficulty,
      search,
      priceMin,
      priceMax,
      isPublished = true,
      includeUnpublished = false,
    } = req.query;

    // Allow admins to see unpublished courses if includeUnpublished is true
    const shouldShowUnpublished =
      includeUnpublished === "true" || includeUnpublished === true;
    const publishedFilter = shouldShowUnpublished ? {} : { isPublished: true };

    // Build filter object
    const filter = {
      ...publishedFilter,
    };

    if (category) filter.category = category;
    if (subject) filter.title = { $regex: subject, $options: "i" };
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get courses with teacher information
    const courses = await Course.find(filter)
      .populate("instructor", "username fullName avatar")
      .populate("enrolledStudents", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add review stats to each course
    const coursesWithReviews = await Promise.all(
      courses.map(async (course) => {
        try {
          const reviewStats = await reviewService.getReviewStats(course._id);
          return {
            ...course,
            rating: reviewStats.averageRating,
            reviewCount: reviewStats.totalReviews,
            ratingDistribution: reviewStats.ratingDistribution,
          };
        } catch (error) {
          return {
            ...course,
            rating: 0,
            reviewCount: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
        }
      })
    );

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    // Add enrollment status for authenticated users
    let coursesWithEnrollmentStatus = coursesWithReviews;
    if (req.user) {
      coursesWithEnrollmentStatus = await Promise.all(
        coursesWithReviews.map(async (course) => {
          const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: course._id,
          }).select("progress isCompleted");

          return {
            ...course,
            isEnrolled: !!enrollment,
            enrollmentProgress: enrollment?.progress || 0,
            isCompleted: enrollment?.isCompleted || false,
          };
        })
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          courses: coursesWithEnrollmentStatus,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCourses,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
          },
        },
        "Courses retrieved successfully"
      )
    );
  });

  // Get course by ID
  getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("instructor", "username fullName avatar email")
      .populate("enrolledStudents", "username fullName avatar");

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Get enrollment details for authenticated user
    let enrollmentDetails = null;
    if (req.user) {
      enrollmentDetails = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      }).select(
        "progress completedLessons isCompleted enrolledAt completedAt certificateUrl"
      );
    }

    // Calculate course statistics
    const stats = {
      totalStudents: course.enrolledStudents.length,
      totalModules: course.modules.length,
      totalLessons: course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0
      ),
      averageRating: course.rating,
      reviewCount: course.reviewCount,
    };

    res.status(200).json(
      new ApiResponse(
        200,
        {
          course,
          stats,
          enrollmentDetails,
        },
        "Course details retrieved successfully"
      )
    );
  });

  // Get courses by category
  getCoursesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find({
      category: { $regex: category, $options: "i" },
      isPublished: true,
    })
      .populate("instructor", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments({
      category: { $regex: category, $options: "i" },
      isPublished: true,
    });

    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    res.status(200).json(
      new ApiResponse(
        200,
        {
          courses,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCourses,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
          },
        },
        `Courses for category ${category} retrieved successfully`
      )
    );
  });

  // Search courses
  searchCourses = asyncHandler(async (req, res) => {
    const { q: searchQuery, page = 1, limit = 10 } = req.query;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Search query must be at least 2 characters long"
          )
        );
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("instructor", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments({
      isPublished: true,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    res.status(200).json(
      new ApiResponse(
        200,
        {
          courses,
          searchQuery,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCourses,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
          },
        },
        "Search results retrieved successfully"
      )
    );
  });

  // Get featured/popular courses
  getFeaturedCourses = asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query;

    // Get courses with highest enrollment
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "username fullName avatar")
      .sort({ enrolledStudents: -1, rating: -1 })
      .limit(parseInt(limit));

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { courses },
          "Featured courses retrieved successfully"
        )
      );
  });

  // Get course categories
  getCategories = asyncHandler(async (req, res) => {
    const categories = await Course.distinct("category", { isPublished: true });

    // Group categories and count courses in each
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await Course.countDocuments({
          category,
          isPublished: true,
        });
        return { name: category, count };
      })
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { categories: categoryStats },
          "Categories retrieved successfully"
        )
      );
  });
}

export const courseController = new CourseController();
