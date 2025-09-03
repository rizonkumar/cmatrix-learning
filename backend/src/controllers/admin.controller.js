import { adminService } from "../services/admin.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AdminController {
  getAllCourses = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      category,
      subject,
      isPublished,
      search,
    } = req.query;

    const filter = adminService.buildCourseFilter({
      category,
      subject,
      isPublished,
      search,
    });
    const result = await adminService.getCoursesWithPagination(
      filter,
      page,
      limit
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Courses retrieved successfully"));
  });

  createCourse = asyncHandler(async (req, res) => {
    const course = await adminService.createCourse(req.body, req.user._id);

    res
      .status(201)
      .json(new ApiResponse(201, { course }, "Course created successfully"));
  });

  // Update course
  updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;

    const updatedCourse = await adminService.updateCourse(courseId, updateData);

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

    await adminService.deleteCourse(courseId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Course deleted successfully"));
  });

  // Publish/Unpublish course
  toggleCoursePublish = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    const course = await adminService.toggleCoursePublish(
      courseId,
      isPublished
    );
    const action = isPublished ? "published" : "unpublished";

    res
      .status(200)
      .json(new ApiResponse(200, { course }, `Course ${action} successfully`));
  });

  // Get course statistics
  getCourseStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getCourseStats();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Course statistics retrieved successfully")
      );
  });

  // Bulk operations
  bulkUpdateCourses = asyncHandler(async (req, res) => {
    const { courseIds, updates } = req.body;

    const result = await adminService.bulkUpdateCourses(courseIds, updates);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Bulk update completed successfully"));
  });

  // Get teachers list
  getTeachers = asyncHandler(async (req, res) => {
    const teachers = await adminService.getTeachers();

    res
      .status(200)
      .json(
        new ApiResponse(200, { teachers }, "Teachers retrieved successfully")
      );
  });

  // Search students by username or email
  searchStudents = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;

    if (!search || search.trim().length < 2) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Search term must be at least 2 characters")
        );
    }

    const result = await adminService.searchStudents(
      search.trim(),
      page,
      limit
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Students search completed successfully")
      );
  });

  getStudentProgress = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const progress = await adminService.getStudentProgress(studentId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          progress,
          "Student progress retrieved successfully"
        )
      );
  });

  getAllStudentsProgress = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const result = await adminService.getAllStudentsProgress(page, limit);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Students progress retrieved successfully")
      );
  });

  getStudentKanbanBoards = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const kanbanData = await adminService.getStudentKanbanBoards(studentId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          kanbanData,
          "Student kanban boards retrieved successfully"
        )
      );
  });

  getStudentAnalytics = asyncHandler(async (req, res) => {
    const analytics = await adminService.getStudentAnalytics();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          analytics,
          "Student analytics retrieved successfully"
        )
      );
  });

  getRecentActivities = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const activities = await adminService.getRecentActivities(limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { activities },
          "Recent activities retrieved successfully"
        )
      );
  });

  // Get comprehensive analytics data
  getAnalytics = asyncHandler(async (req, res) => {
    const { timeRange = "30d" } = req.query;

    const analytics = await adminService.getComprehensiveAnalytics(timeRange);

    res
      .status(200)
      .json(
        new ApiResponse(200, analytics, "Analytics data retrieved successfully")
      );
  });

  // System Settings Methods
  getSystemSettings = asyncHandler(async (req, res) => {
    const settings = await adminService.getSystemSettings();

    res
      .status(200)
      .json(
        new ApiResponse(200, { settings }, "System settings retrieved successfully")
      );
  });

  updateSystemSettings = asyncHandler(async (req, res) => {
    const { settings } = req.body;

    const updatedSettings = await adminService.updateSystemSettings(settings);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { settings: updatedSettings },
          "System settings updated successfully"
        )
      );
  });

  testEmailSettings = asyncHandler(async (req, res) => {
    const { emailSettings } = req.body;

    const result = await adminService.testEmailSettings(emailSettings);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Email settings tested successfully")
      );
  });
}

export const adminController = new AdminController();
