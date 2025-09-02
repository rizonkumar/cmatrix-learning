import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { KanbanBoard } from "../models/kanbanBoard.model.js";
import { KanbanColumn } from "../models/kanbanColumn.model.js";
import { KanbanCard } from "../models/kanbanCard.model.js";
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
      .populate("instructor", "username fullName avatar email")
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
      .populate("instructor", "username fullName avatar email")
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

  // Search students by username or email
  async searchStudents(searchTerm, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchFilter = {
      role: "student",
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const students = await User.find(searchFilter)
      .select(
        "username fullName email avatar createdAt currentStreak longestStreak lastActivityDate"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalStudents = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalStudents / parseInt(limit));

    return {
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Get detailed student progress
  async getStudentProgress(studentId) {
    // Validate student exists and is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      throw new ApiError(404, "Student not found");
    }

    // Get all enrollments for the student
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select: "title category thumbnailUrl teacher",
        populate: {
          path: "teacher",
          select: "username fullName",
        },
      })
      .sort({ enrolledAt: -1 });

    // Calculate progress statistics
    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.isCompleted).length;
    const inProgressCourses = enrollments.filter(
      (e) => !e.isCompleted && e.progress > 0
    ).length;
    const notStartedCourses = enrollments.filter(
      (e) => e.progress === 0
    ).length;

    // Calculate average progress
    const averageProgress =
      totalEnrollments > 0
        ? enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments
        : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletions = await Enrollment.find({
      student: studentId,
      completedAt: { $gte: thirtyDaysAgo },
    }).countDocuments();

    return {
      student: {
        _id: student._id,
        username: student.username,
        fullName: student.fullName,
        email: student.email,
        avatar: student.avatar,
        currentStreak: student.currentStreak,
        longestStreak: student.longestStreak,
        lastActivityDate: student.lastActivityDate,
        joinedAt: student.createdAt,
      },
      progress: {
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        notStartedCourses,
        averageProgress: Math.round(averageProgress * 100) / 100,
        recentCompletions,
      },
      enrollments: enrollments.map((enrollment) => ({
        _id: enrollment._id,
        course: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedLessonsCount: enrollment.completedLessons.length,
        currentLesson: enrollment.currentLesson,
        certificateUrl: enrollment.certificateUrl,
      })),
    };
  }

  // Get all students with their progress overview
  async getAllStudentsProgress(page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get students with their enrollment counts
    const students = await User.find({ role: "student" })
      .select(
        "username fullName email avatar createdAt currentStreak longestStreak lastActivityDate"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get enrollment stats for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({
          student: student._id,
        }).select("progress isCompleted");

        const totalEnrollments = enrollments.length;
        const completedCourses = enrollments.filter(
          (e) => e.isCompleted
        ).length;
        const averageProgress =
          totalEnrollments > 0
            ? enrollments.reduce((sum, e) => sum + e.progress, 0) /
              totalEnrollments
            : 0;

        return {
          ...student.toObject(),
          progress: {
            totalEnrollments,
            completedCourses,
            averageProgress: Math.round(averageProgress * 100) / 100,
          },
        };
      })
    );

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalPages = Math.ceil(totalStudents / parseInt(limit));

    return {
      students: studentsWithProgress,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Get student's kanban boards
  async getStudentKanbanBoards(studentId) {
    // Validate student exists and is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      throw new ApiError(404, "Student not found");
    }

    const boards = await KanbanBoard.find({
      owner: studentId,
      isActive: true,
    }).sort({ createdAt: -1 });

    // Get detailed information for each board
    const boardsWithDetails = await Promise.all(
      boards.map(async (board) => {
        const columns = await KanbanColumn.find({ boardId: board._id }).sort({
          order: 1,
        });

        const columnDetails = await Promise.all(
          columns.map(async (column) => {
            const cards = await KanbanCard.find({ columnId: column._id })
              .populate("assignedTo", "username fullName avatar")
              .sort({ order: 1 });

            return {
              ...column.toObject(),
              cards: cards.map((card) => ({
                ...card.toObject(),
                commentsCount: card.comments.length,
                attachmentsCount: card.attachments.length,
              })),
            };
          })
        );

        const totalCards = columnDetails.reduce(
          (sum, col) => sum + col.cards.length,
          0
        );

        return {
          ...board.toObject(),
          columns: columnDetails,
          stats: {
            totalColumns: columns.length,
            totalCards,
          },
        };
      })
    );

    return {
      student: {
        _id: student._id,
        username: student.username,
        fullName: student.fullName,
        email: student.email,
      },
      boards: boardsWithDetails,
      summary: {
        totalBoards: boardsWithDetails.length,
        totalCards: boardsWithDetails.reduce(
          (sum, board) => sum + board.stats.totalCards,
          0
        ),
      },
    };
  }

  // Get student analytics/overview for admin dashboard
  async getStudentAnalytics() {
    const totalStudents = await User.countDocuments({ role: "student" });

    // Active students (activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeStudents = await User.countDocuments({
      role: "student",
      lastActivityDate: { $gte: thirtyDaysAgo },
    });

    // Enrollment statistics
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({
      isCompleted: true,
    });

    // Average progress
    const progressStats = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          averageProgress: { $avg: "$progress" },
          totalProgress: { $sum: "$progress" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performing students (by completion rate)
    const topStudents = await User.aggregate([
      {
        $match: { role: "student" },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "student",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          totalEnrollments: { $size: "$enrollments" },
          completedEnrollments: {
            $size: {
              $filter: {
                input: "$enrollments",
                as: "enrollment",
                cond: "$$enrollment.isCompleted",
              },
            },
          },
        },
      },
      {
        $addFields: {
          completionRate: {
            $cond: {
              if: { $gt: ["$totalEnrollments", 0] },
              then: { $divide: ["$completedEnrollments", "$totalEnrollments"] },
              else: 0,
            },
          },
        },
      },
      {
        $sort: { completionRate: -1, totalEnrollments: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          totalEnrollments: 1,
          completedEnrollments: 1,
          completionRate: { $multiply: ["$completionRate", 100] },
          currentStreak: 1,
          longestStreak: 1,
        },
      },
    ]);

    return {
      overview: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        activityRate:
          totalStudents > 0
            ? Math.round((activeStudents / totalStudents) * 100)
            : 0,
      },
      enrollmentStats: {
        totalEnrollments,
        completedEnrollments,
        completionRate:
          totalEnrollments > 0
            ? Math.round((completedEnrollments / totalEnrollments) * 100)
            : 0,
        averageProgress: progressStats[0]?.averageProgress
          ? Math.round(progressStats[0].averageProgress * 100) / 100
          : 0,
      },
      topStudents,
    };
  }

  // Get recent activities for admin dashboard
  async getRecentActivities(limit = 10) {
    const activities = [];

    try {
      // Recent user registrations (students and teachers)
      const recentUsers = await User.find({
        role: { $in: ["student", "teacher"] },
      })
        .select("username fullName avatar createdAt role")
        .sort({ createdAt: -1 })
        .limit(5);

      recentUsers.forEach((user) => {
        activities.push({
          id: `user_${user._id}`,
          type: "user_registration",
          action: `New ${user.role} registered: ${user.fullName}`,
          time: user.createdAt,
          timeAgo: this.getTimeAgo(user.createdAt),
          icon: "Users",
          color: "bg-purple-500",
          user: {
            id: user._id,
            name: user.fullName,
            avatar: user.avatar,
          },
        });
      });

      // Recent course completions
      const recentCompletions = await Enrollment.find({
        isCompleted: true,
        completedAt: { $exists: true },
      })
        .populate("student", "username fullName avatar")
        .populate("course", "title category")
        .sort({ completedAt: -1 })
        .limit(5);

      recentCompletions.forEach((enrollment) => {
        activities.push({
          id: `completion_${enrollment._id}`,
          type: "course_completion",
          action: `Course completed: ${enrollment.student?.fullName} finished ${enrollment.course?.title}`,
          time: enrollment.completedAt,
          timeAgo: this.getTimeAgo(enrollment.completedAt),
          icon: "CheckCircle",
          color: "bg-green-500",
          user: enrollment.student,
          course: enrollment.course,
        });
      });

      // Recent enrollments
      const recentEnrollments = await Enrollment.find({
        isCompleted: false,
      })
        .populate("student", "username fullName avatar")
        .populate("course", "title category")
        .sort({ enrolledAt: -1 })
        .limit(5);

      recentEnrollments.forEach((enrollment) => {
        activities.push({
          id: `enrollment_${enrollment._id}`,
          type: "course_enrollment",
          action: `New enrollment: ${enrollment.student?.fullName} joined ${enrollment.course?.title}`,
          time: enrollment.enrolledAt,
          timeAgo: this.getTimeAgo(enrollment.enrolledAt),
          icon: "BookOpen",
          color: "bg-blue-500",
          user: enrollment.student,
          course: enrollment.course,
        });
      });

      // Recent course creations/updates
      const recentCourses = await Course.find()
        .populate("instructor", "username fullName")
        .select("title category isPublished createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(3);

      recentCourses.forEach((course) => {
        const action = course.isPublished ? "published" : "created";
        activities.push({
          id: `course_${course._id}`,
          type: "course_update",
          action: `Course ${action}: ${course.title} (${course.category})`,
          time: course.createdAt,
          timeAgo: this.getTimeAgo(course.createdAt),
          icon: "BookOpen",
          color: "bg-indigo-500",
          course: {
            id: course._id,
            title: course.title,
            category: course.category,
          },
        });
      });

      // Sort all activities by time (most recent first)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));

      // Return only the requested limit
      return activities.slice(0, parseInt(limit));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      // Return empty array on error to prevent dashboard crash
      return [];
    }
  }

  // Helper function to calculate time ago
  getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }
}

export const adminService = new AdminService();
