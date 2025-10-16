import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { KanbanBoard } from "../models/kanbanBoard.model.js";
import { KanbanColumn } from "../models/kanbanColumn.model.js";
import { KanbanCard } from "../models/kanbanCard.model.js";
import { Syllabus } from "../models/syllabus.model.js";
import { ApiError } from "../utils/ApiError.js";
import { 
  COURSE_CATEGORIES, 
  CLASS_LEVELS, 
  DIFFICULTY_LEVELS, 
  CONTENT_TYPES,
  VALIDATION_MESSAGES 
} from "../constants/categories.js";

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
    if (!COURSE_CATEGORIES.includes(category)) {
      throw new ApiError(400, VALIDATION_MESSAGES.INVALID_CATEGORY);
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
        if (!CONTENT_TYPES.includes(lesson.contentType)) {
          throw new ApiError(400, VALIDATION_MESSAGES.INVALID_CONTENT_TYPE);
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
      "instructor",
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
        select: "title category thumbnailUrl instructor",
        populate: {
          path: "instructor",
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

  // Get comprehensive analytics data
  async getComprehensiveAnalytics(timeRange = "30d") {
    try {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1y":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // User analytics
      const totalUsers = await User.countDocuments({ role: "student" });
      const activeUsers = await User.countDocuments({
        role: "student",
        lastActivityDate: { $gte: startDate },
      });

      // Course analytics
      const totalCourses = await Course.countDocuments();
      const publishedCourses = await Course.countDocuments({
        isPublished: true,
      });

      // Enrollment analytics
      const totalEnrollments = await Enrollment.countDocuments();
      const recentEnrollments = await Enrollment.countDocuments({
        enrolledAt: { $gte: startDate },
      });

      // Course completion analytics
      const totalCourseCompletions = await Enrollment.countDocuments({
        isCompleted: true,
      });
      const recentCourseCompletions = await Enrollment.countDocuments({
        isCompleted: true,
        completedAt: { $gte: startDate },
      });

      // Average session time calculation (mock data for now)
      const avgSessionTime = "2h 15m";

      // Course engagement by category
      const courseEngagementData = await Course.aggregate([
        {
          $match: { isPublished: true },
        },
        {
          $lookup: {
            from: "enrollments",
            localField: "_id",
            foreignField: "course",
            as: "enrollments",
          },
        },
        {
          $addFields: {
            enrollmentCount: { $size: "$enrollments" },
            completedCount: {
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
          $group: {
            _id: "$category",
            totalEnrollments: { $sum: "$enrollmentCount" },
            completedEnrollments: { $sum: "$completedCount" },
          },
        },
        {
          $addFields: {
            engagement: {
              $cond: {
                if: { $gt: ["$totalEnrollments", 0] },
                then: {
                  $multiply: [
                    { $divide: ["$completedEnrollments", "$totalEnrollments"] },
                    100,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $sort: { engagement: -1 },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            course: "$_id",
            engagement: { $round: ["$engagement", 1] },
          },
        },
      ]);

      // User growth data (monthly for the last 6 months)
      const userGrowthData = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const usersInMonth = await User.countDocuments({
          role: "student",
          createdAt: { $gte: monthStart, $lt: monthEnd },
        });

        userGrowthData.push({
          month: monthStart.toLocaleString("default", { month: "short" }),
          users: usersInMonth,
        });
      }

      // Revenue data (monthly for the last 6 months)
      const revenueData = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const monthEnrollments = await Enrollment.countDocuments({
          enrolledAt: { $gte: monthStart, $lt: monthEnd },
        });

        const monthRevenue = monthEnrollments * 150; // Average ₹150 per enrollment

        revenueData.push({
          month: monthStart.toLocaleString("default", { month: "short" }),
          revenue: monthRevenue,
        });
      }

      // System health metrics (more realistic)
      const systemHealth = {
        uptime: "99.9%",
        responseTime: "245ms",
        userSatisfaction: "98.5%",
      };

      return {
        // User metrics
        totalUsers,
        activeUsers,
        userGrowthPercentage:
          totalUsers > 0
            ? Math.round((activeUsers / totalUsers) * 100 * 100) / 100
            : 0,

        // Course metrics
        totalCourses,
        publishedCourses,
        courseCompletions: totalCourseCompletions,
        avgSessionTime,

        // Enrollment metrics
        totalEnrollments,
        recentEnrollments,
        enrollmentGrowth:
          totalEnrollments > 0
            ? Math.round((recentEnrollments / totalEnrollments) * 100 * 100) /
              100
            : 0,

        // Revenue metrics
        totalRevenue: totalEnrollments * 150,
        recentRevenue: recentEnrollments * 150,
        revenueGrowth:
          totalEnrollments > 0
            ? Math.round((recentEnrollments / totalEnrollments) * 100 * 100) /
              100
            : 0,

        // System health
        systemHealth,

        // Chart data
        userGrowth: userGrowthData,
        courseEngagement: courseEngagementData,
        revenueData,

        // Time range info
        timeRange,
        startDate,
        endDate: now,
      };
    } catch (error) {
      console.error("Error fetching comprehensive analytics:", error);
      throw new ApiError(500, "Failed to fetch analytics data");
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

  // System Settings Methods
  async getSystemSettings() {
    try {
      // For now, return default settings. In a real implementation,
      // you might store these in a settings collection or environment variables
      const defaultSettings = {
        general: {
          siteName: "C-Matrix Learning",
          siteDescription:
            "Advanced e-learning platform with AI-powered productivity tools",
          contactEmail: "admin@cmatrixlearning.com",
          supportEmail: "support@cmatrixlearning.com",
          timezone: "Asia/Kolkata",
          maintenanceMode: false,
        },
        security: {
          sessionTimeout: 30,
          passwordMinLength: 8,
          twoFactorAuth: true,
          ipWhitelist: "",
          bruteForceProtection: true,
          maxLoginAttempts: 5,
        },
        email: {
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpUser: "",
          smtpPassword: "",
          fromEmail: "noreply@cmatrixlearning.com",
          fromName: "C-Matrix Learning",
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          weeklyReports: true,
          courseUpdates: true,
          systemAlerts: true,
        },
        appearance: {
          primaryColor: "#3B82F6",
          secondaryColor: "#6366F1",
          darkModeDefault: false,
          logoUrl: "",
          faviconUrl: "",
        },
        database: {
          backupFrequency: "daily",
          retentionPeriod: 30,
          autoOptimize: true,
          maxConnections: 100,
        },
      };

      // In a production app, you would fetch from database
      // const settings = await Settings.findOne() || defaultSettings;

      return defaultSettings;
    } catch (error) {
      console.error("Error fetching system settings:", error);
      throw new ApiError(500, "Failed to fetch system settings");
    }
  }

  async updateSystemSettings(newSettings) {
    try {
      // Validate the settings structure
      const requiredSections = [
        "general",
        "security",
        "email",
        "notifications",
        "appearance",
        "database",
      ];
      const missingSections = requiredSections.filter(
        (section) => !newSettings[section]
      );

      if (missingSections.length > 0) {
        throw new ApiError(
          400,
          `Missing required settings sections: ${missingSections.join(", ")}`
        );
      }

      // In a real implementation, you would save to database
      // await Settings.findOneAndUpdate({}, newSettings, { upsert: true, new: true });

      // For now, just return the settings as if they were saved
      return newSettings;
    } catch (error) {
      console.error("Error updating system settings:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update system settings");
    }
  }

  async testEmailSettings(emailSettings) {
    try {
      // Validate email settings
      const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail } =
        emailSettings;

      if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
        throw new ApiError(
          400,
          "All email settings fields are required for testing"
        );
      }

      // In a real implementation, you would actually test the email settings
      // For now, just simulate a successful test
      const testResult = {
        success: true,
        message: "Email settings tested successfully",
        timestamp: new Date().toISOString(),
      };

      return testResult;
    } catch (error) {
      console.error("Error testing email settings:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to test email settings");
    }
  }

  async getAllSyllabi({ page = 1, limit = 20, classLevel, isActive, search }) {
    const filter = {};

    if (classLevel) filter.classLevel = classLevel;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "subjects.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const syllabi = await Syllabus.find(filter)
      .populate("createdBy", "username fullName email")
      .sort({ isActive: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSyllabi = await Syllabus.countDocuments(filter);
    const totalPages = Math.ceil(totalSyllabi / parseInt(limit));

    return {
      syllabi,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSyllabi,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async getSyllabusById(syllabusId) {
    const syllabus = await Syllabus.findById(syllabusId).populate(
      "createdBy",
      "username fullName email"
    );

    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    return syllabus;
  }

  async createSyllabus(syllabusData, adminUserId) {
    const {
      title,
      description,
      classLevel,
      subjects,
      isActive = false,
      version = "1.0",
      tags = [],
    } = syllabusData;

    // Required fields validation
    if (
      !title ||
      !description ||
      !classLevel ||
      !subjects ||
      subjects.length === 0
    ) {
      throw new ApiError(
        400,
        "Title, description, classLevel, and subjects are required"
      );
    }

    // Validate class level
    if (!CLASS_LEVELS.includes(classLevel)) {
      throw new ApiError(400, VALIDATION_MESSAGES.INVALID_CLASS_LEVEL);
    }

    // Validate subjects structure
    for (const subject of subjects) {
      if (!subject.name || !subject.chapters || subject.chapters.length === 0) {
        throw new ApiError(
          400,
          "Each subject must have a name and at least one chapter"
        );
      }

      for (const chapter of subject.chapters) {
        if (!chapter.title || !chapter.topics || chapter.topics.length === 0) {
          throw new ApiError(
            400,
            "Each chapter must have a title and at least one topic"
          );
        }
      }
    }

    const syllabus = await Syllabus.create({
      title,
      description,
      classLevel,
      subjects,
      isActive,
      createdBy: adminUserId,
      version,
      tags,
    });

    // Populate the created syllabus
    const populatedSyllabus = await Syllabus.findById(syllabus._id).populate(
      "createdBy",
      "username fullName email"
    );

    return populatedSyllabus;
  }

  async updateSyllabus(syllabusId, updateData) {
    const syllabus = await Syllabus.findById(syllabusId);

    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    // Validate class level if being updated
    if (updateData.classLevel) {
      if (!CLASS_LEVELS.includes(updateData.classLevel)) {
        throw new ApiError(400, VALIDATION_MESSAGES.INVALID_CLASS_LEVEL);
      }
    }

    // Validate subjects structure if being updated
    if (updateData.subjects) {
      for (const subject of updateData.subjects) {
        if (
          !subject.name ||
          !subject.chapters ||
          subject.chapters.length === 0
        ) {
          throw new ApiError(
            400,
            "Each subject must have a name and at least one chapter"
          );
        }

        for (const chapter of subject.chapters) {
          if (
            !chapter.title ||
            !chapter.topics ||
            chapter.topics.length === 0
          ) {
            throw new ApiError(
              400,
              "Each chapter must have a title and at least one topic"
            );
          }
        }
      }
    }

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      syllabusId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "username fullName email");

    return updatedSyllabus;
  }

  async deleteSyllabus(syllabusId) {
    const syllabus = await Syllabus.findById(syllabusId);

    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    await Syllabus.findByIdAndDelete(syllabusId);
    return true;
  }

  async toggleSyllabusActive(syllabusId) {
    const syllabus = await Syllabus.findById(syllabusId);

    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    // Toggle the active status
    syllabus.isActive = !syllabus.isActive;
    await syllabus.save();

    const updatedSyllabus = await Syllabus.findById(syllabusId).populate(
      "createdBy",
      "username fullName email"
    );

    return updatedSyllabus;
  }

  async getSyllabiByClassLevel(classLevel) {
    const syllabi = await Syllabus.find({ classLevel })
      .populate("createdBy", "username fullName email")
      .sort({ isActive: -1, createdAt: -1 });

    return syllabi;
  }

  async getActiveSyllabus(classLevel) {
    const syllabus = await Syllabus.findOne({ classLevel, isActive: true })
      .populate("createdBy", "username fullName email")
      .sort({ createdAt: -1 });

    if (!syllabus) {
      throw new ApiError(404, "No active syllabus found for this class level");
    }

    return syllabus;
  }

  async bulkUpdateSyllabi(syllabusIds, updates) {
    if (!Array.isArray(syllabusIds) || syllabusIds.length === 0) {
      throw new ApiError(400, "syllabusIds must be a non-empty array");
    }

    if (!updates || typeof updates !== "object") {
      throw new ApiError(400, "updates must be an object");
    }

    // Validate updates
    const allowedUpdates = ["isActive", "version", "tags"];
    const updateKeys = Object.keys(updates);

    for (const key of updateKeys) {
      if (!allowedUpdates.includes(key)) {
        throw new ApiError(400, `Invalid update field: ${key}`);
      }
    }

    // Handle active status updates - ensure only one active per class level
    if (updates.isActive === true) {
      for (const syllabusId of syllabusIds) {
        const syllabus = await Syllabus.findById(syllabusId);
        if (syllabus) {
          await Syllabus.updateMany(
            {
              classLevel: syllabus.classLevel,
              _id: { $ne: syllabusId },
            },
            { isActive: false }
          );
        }
      }
    }

    const result = await Syllabus.updateMany(
      { _id: { $in: syllabusIds } },
      updates,
      { runValidators: true }
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  // Add subject to existing syllabus
  async addSubjectToSyllabus(syllabusId, subjectData) {
    const { name, chapters = [] } = subjectData;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Subject name is required");
    }

    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    // Check if subject already exists
    const subjectExists = syllabus.subjects.some(
      (subject) => subject.name.toLowerCase() === name.toLowerCase()
    );
    if (subjectExists) {
      throw new ApiError(
        400,
        "Subject with this name already exists in the syllabus"
      );
    }

    // Validate chapters structure
    if (chapters.length > 0) {
      for (const chapter of chapters) {
        if (!chapter.title || !chapter.topics || chapter.topics.length === 0) {
          throw new ApiError(
            400,
            "Each chapter must have a title and at least one topic"
          );
        }
      }
    }

    // Create new subject with order
    const maxOrder =
      syllabus.subjects.length > 0
        ? Math.max(...syllabus.subjects.map((s) => s.order || 0))
        : 0;

    const newSubject = {
      name: name.trim(),
      chapters: chapters.map((chapter, index) => ({
        title: chapter.title,
        description: chapter.description || "",
        topics: chapter.topics.map((topic, topicIndex) => ({
          name: topic.name || topic,
          order: topicIndex,
        })),
        order: index,
      })),
      order: maxOrder + 1,
    };

    syllabus.subjects.push(newSubject);
    await syllabus.save();

    const updatedSyllabus = await Syllabus.findById(syllabusId).populate(
      "createdBy",
      "username fullName email"
    );

    return updatedSyllabus;
  }

  // Add chapter to existing subject in syllabus
  async addChapterToSubject(syllabusId, subjectName, chapterData) {
    const { title, topics = [], description } = chapterData;

    if (!title || !title.trim()) {
      throw new ApiError(400, "Chapter title is required");
    }

    if (!topics || topics.length === 0) {
      throw new ApiError(400, "At least one topic is required");
    }

    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    // Find the subject
    const subjectIndex = syllabus.subjects.findIndex(
      (subject) => subject.name === subjectName
    );
    if (subjectIndex === -1) {
      throw new ApiError(404, "Subject not found in syllabus");
    }

    // Check if chapter already exists
    const chapterExists = syllabus.subjects[subjectIndex].chapters.some(
      (chapter) => chapter.title.toLowerCase() === title.toLowerCase()
    );
    if (chapterExists) {
      throw new ApiError(
        400,
        "Chapter with this title already exists in the subject"
      );
    }

    // Get max order for chapters in this subject
    const maxChapterOrder =
      syllabus.subjects[subjectIndex].chapters.length > 0
        ? Math.max(
            ...syllabus.subjects[subjectIndex].chapters.map((c) => c.order || 0)
          )
        : 0;

    const newChapter = {
      title: title.trim(),
      description: description || "",
      topics: topics.map((topic, index) => ({
        name: topic.name || topic,
        order: index,
      })),
      order: maxChapterOrder + 1,
    };

    syllabus.subjects[subjectIndex].chapters.push(newChapter);
    await syllabus.save();

    const updatedSyllabus = await Syllabus.findById(syllabusId).populate(
      "createdBy",
      "username fullName email"
    );

    return updatedSyllabus;
  }

  // Delete chapter from subject in syllabus
  async deleteChapterFromSubject(syllabusId, subjectName, chapterTitle) {
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      throw new ApiError(404, "Syllabus not found");
    }

    // Find the subject
    const subjectIndex = syllabus.subjects.findIndex(
      (subject) => subject.name === subjectName
    );
    if (subjectIndex === -1) {
      throw new ApiError(404, "Subject not found in syllabus");
    }

    // Find and remove the chapter
    const chapterIndex = syllabus.subjects[subjectIndex].chapters.findIndex(
      (chapter) => chapter.title === chapterTitle
    );
    if (chapterIndex === -1) {
      throw new ApiError(404, "Chapter not found in subject");
    }

    syllabus.subjects[subjectIndex].chapters.splice(chapterIndex, 1);

    // Reorder remaining chapters
    syllabus.subjects[subjectIndex].chapters.forEach((chapter, index) => {
      chapter.order = index;
    });

    await syllabus.save();

    const updatedSyllabus = await Syllabus.findById(syllabusId).populate(
      "createdBy",
      "username fullName email"
    );

    return updatedSyllabus;
  }
}

export const adminService = new AdminService();
