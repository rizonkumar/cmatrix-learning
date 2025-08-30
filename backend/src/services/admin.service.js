import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

class AdminService {
  // Build course filter based on query parameters
  buildCourseFilter(queryParams) {
    const { category, subject, isPublished, search } = queryParams;
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

    return filter;
  }

  // Get courses with pagination
  async getCoursesWithPagination(filter, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(filter)
      .populate("teacher", "username fullName avatar email")
      .populate("enrolledStudents", "username fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    return {
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Validate teacher exists and is a teacher
  async validateTeacher(teacherId) {
    if (!teacherId) return null;

    const teacherUser = await User.findById(teacherId);
    if (!teacherUser || teacherUser.role !== "teacher") {
      throw new ApiError(400, "Invalid teacher ID");
    }

    return teacherUser;
  }

  // Validate course category
  validateCategory(category) {
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
  }

  // Validate course modules structure
  validateModules(modules) {
    if (!modules || modules.length === 0) {
      throw new ApiError(400, "Modules cannot be empty");
    }

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
  }

  // Validate course data for creation/update
  async validateCourseData(courseData, isUpdate = false) {
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
    } = courseData;

    // Required fields validation
    if (!isUpdate && (!title || !description || !category || !modules)) {
      throw new ApiError(
        400,
        "All fields are required and modules cannot be empty"
      );
    }

    // Validate teacher if provided
    if (teacher) {
      await this.validateTeacher(teacher);
    }

    // Validate category
    this.validateCategory(category);

    // Validate modules
    this.validateModules(modules);

    return {
      title,
      description,
      category,
      modules,
      teacher,
      thumbnailUrl:
        thumbnailUrl ||
        `https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400`,
      price: parseFloat(price),
      isPublished,
      difficulty,
    };
  }

  // Create new course
  async createCourse(courseData, adminUserId) {
    const validatedData = await this.validateCourseData(courseData);

    const courseDataToCreate = {
      ...validatedData,
      teacher: validatedData.teacher || adminUserId,
    };

    const course = await Course.create(courseDataToCreate);

    // Populate the created course
    const populatedCourse = await Course.findById(course._id).populate(
      "teacher",
      "username fullName avatar email"
    );

    return populatedCourse;
  }

  // Update course
  async updateCourse(courseId, updateData) {
    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Validate teacher if being updated
    if (updateData.teacher) {
      await this.validateTeacher(updateData.teacher);
    }

    // Validate category if being updated
    if (updateData.category) {
      this.validateCategory(updateData.category);
    }

    // Validate modules structure if being updated
    if (updateData.modules) {
      this.validateModules(updateData.modules);
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("teacher", "username fullName avatar email")
      .populate("enrolledStudents", "username fullName");

    return updatedCourse;
  }

  // Delete course
  async deleteCourse(courseId) {
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
    return true;
  }

  // Toggle course publish status
  async toggleCoursePublish(courseId, isPublished) {
    if (typeof isPublished !== "boolean") {
      throw new ApiError(400, "isPublished must be a boolean value");
    }

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    course.isPublished = isPublished;
    await course.save();

    return course;
  }

  // Get course statistics
  async getCourseStats() {
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

    return {
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
    };
  }

  // Bulk update courses
  async bulkUpdateCourses(courseIds, updates) {
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
      await this.validateTeacher(updates.teacher);
    }

    const result = await Course.updateMany(
      { _id: { $in: courseIds } },
      updates,
      { runValidators: true }
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  // Get teachers list
  async getTeachers() {
    const teachers = await User.find({ role: "teacher" })
      .select("username fullName email avatar createdAt")
      .sort({ createdAt: -1 });

    return teachers;
  }
}

export const adminService = new AdminService();
