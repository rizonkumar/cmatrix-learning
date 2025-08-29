import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AdminController {
  // Get all courses (admin view with full details)
  getAllCourses = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      category,
      subject,
      isPublished,
      search,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (subject) filter.title = { $regex: subject, $options: "i" };
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(filter)
      .populate("teacher", "username fullName avatar email")
      .populate("enrolledStudents", "username fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(filter);
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
        "Courses retrieved successfully"
      )
    );
  });

  // Create new course
  createCourse = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      category,
      modules,
      teacher,
      thumbnailUrl,
      price = 0,
      isPublished = false,
      difficulty = "beginner",
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !modules ||
      modules.length === 0
    ) {
      throw new ApiError(
        400,
        "All fields are required and modules cannot be empty"
      );
    }

    // Validate teacher exists and is a teacher
    if (teacher) {
      const teacherUser = await User.findById(teacher);
      if (!teacherUser || teacherUser.role !== "teacher") {
        throw new ApiError(400, "Invalid teacher ID");
      }
    }

    // Validate category format
    const validCategories = [
      "CBSE Class 8",
      "CBSE Class 9",
      "CBSE Class 10",
      "CBSE Class 11",
      "CBSE Class 12",
      "NEET",
      "IIT-JEE",
    ];

    if (!validCategories.includes(category)) {
      throw new ApiError(
        400,
        "Invalid category. Must be one of: " + validCategories.join(", ")
      );
    }

    // Validate modules structure
    for (const module of modules) {
      if (!module.title || !module.lessons || module.lessons.length === 0) {
        throw new ApiError(
          400,
          "Each module must have a title and at least one lesson"
        );
      }

      for (const lesson of module.lessons) {
        if (!lesson.title || !lesson.contentType) {
          throw new ApiError(
            400,
            "Each lesson must have a title and contentType"
          );
        }
        if (!["video", "pdf", "text"].includes(lesson.contentType)) {
          throw new ApiError(
            400,
            "Invalid contentType. Must be video, pdf, or text"
          );
        }
      }
    }

    const courseData = {
      title,
      description,
      category,
      modules,
      teacher: teacher || req.user._id,
      thumbnailUrl:
        thumbnailUrl ||
        `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400`,
      price: parseFloat(price),
      isPublished,
      difficulty,
    };

    const course = await Course.create(courseData);

    // Populate the created course
    const populatedCourse = await Course.findById(course._id).populate(
      "teacher",
      "username fullName avatar email"
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { course: populatedCourse },
          "Course created successfully"
        )
      );
  });

  // Update course
  updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Validate teacher if being updated
    if (updateData.teacher) {
      const teacherUser = await User.findById(updateData.teacher);
      if (!teacherUser || teacherUser.role !== "teacher") {
        throw new ApiError(400, "Invalid teacher ID");
      }
    }

    // Validate category if being updated
    if (updateData.category) {
      const validCategories = [
        "CBSE Class 8",
        "CBSE Class 9",
        "CBSE Class 10",
        "CBSE Class 11",
        "CBSE Class 12",
        "NEET",
        "IIT-JEE",
      ];

      if (!validCategories.includes(updateData.category)) {
        throw new ApiError(400, "Invalid category");
      }
    }

    // Validate modules structure if being updated
    if (updateData.modules) {
      for (const module of updateData.modules) {
        if (!module.title || !module.lessons || module.lessons.length === 0) {
          throw new ApiError(
            400,
            "Each module must have a title and at least one lesson"
          );
        }

        for (const lesson of module.lessons) {
          if (!lesson.title || !lesson.contentType) {
            throw new ApiError(
              400,
              "Each lesson must have a title and contentType"
            );
          }
          if (!["video", "pdf", "text"].includes(lesson.contentType)) {
            throw new ApiError(400, "Invalid contentType");
          }
        }
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("teacher", "username fullName avatar email")
      .populate("enrolledStudents", "username fullName");

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { course: updatedCourse },
          "Course updated successfully"
        )
      );
  });

  // Delete course
  deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Check if course has enrolled students
    if (course.enrolledStudents && course.enrolledStudents.length > 0) {
      throw new ApiError(
        400,
        "Cannot delete course with enrolled students. Unenroll all students first."
      );
    }

    await Course.findByIdAndDelete(courseId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Course deleted successfully"));
  });

  // Publish/Unpublish course
  toggleCoursePublish = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      throw new ApiError(400, "isPublished must be a boolean value");
    }

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    course.isPublished = isPublished;
    await course.save();

    const action = isPublished ? "published" : "unpublished";

    res
      .status(200)
      .json(new ApiResponse(200, { course }, `Course ${action} successfully`));
  });

  // Get course statistics
  getCourseStats = asyncHandler(async (req, res) => {
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const unpublishedCourses = await Course.countDocuments({
      isPublished: false,
    });

    // Get courses by category
    const categoryStats = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          publishedCount: {
            $sum: { $cond: ["$isPublished", 1, 0] },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get enrollment statistics
    const enrollmentStats = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
          averageEnrollments: { $avg: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          overview: {
            totalCourses,
            publishedCourses,
            unpublishedCourses,
          },
          categoryStats,
          enrollmentStats: enrollmentStats[0] || {
            totalEnrollments: 0,
            averageEnrollments: 0,
          },
        },
        "Course statistics retrieved successfully"
      )
    );
  });

  // Bulk operations
  bulkUpdateCourses = asyncHandler(async (req, res) => {
    const { courseIds, updates } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      throw new ApiError(400, "courseIds must be a non-empty array");
    }

    if (!updates || typeof updates !== "object") {
      throw new ApiError(400, "updates must be an object");
    }

    // Validate updates
    const allowedUpdates = ["isPublished", "price", "difficulty", "teacher"];
    const updateKeys = Object.keys(updates);

    for (const key of updateKeys) {
      if (!allowedUpdates.includes(key)) {
        throw new ApiError(400, `Invalid update field: ${key}`);
      }
    }

    // Validate teacher if being updated
    if (updates.teacher) {
      const teacherUser = await User.findById(updates.teacher);
      if (!teacherUser || teacherUser.role !== "teacher") {
        throw new ApiError(400, "Invalid teacher ID");
      }
    }

    const result = await Course.updateMany(
      { _id: { $in: courseIds } },
      updates,
      { runValidators: true }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
        "Bulk update completed successfully"
      )
    );
  });

  // Get teachers list
  getTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: "teacher" })
      .select("username fullName email avatar createdAt")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        new ApiResponse(200, { teachers }, "Teachers retrieved successfully")
      );
  });
}

export const adminController = new AdminController();
