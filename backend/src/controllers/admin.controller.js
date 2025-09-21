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
        new ApiResponse(
          200,
          { settings },
          "System settings retrieved successfully"
        )
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
      .json(new ApiResponse(200, result, "Email settings tested successfully"));
  });

  getAllSyllabi = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, classLevel, isActive, search } = req.query;

    const result = await adminService.getAllSyllabi({
      page,
      limit,
      classLevel,
      isActive,
      search,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Syllabi retrieved successfully"));
  });

  getSyllabusById = asyncHandler(async (req, res) => {
    const { syllabusId } = req.params;

    const syllabus = await adminService.getSyllabusById(syllabusId);

    res
      .status(200)
      .json(
        new ApiResponse(200, { syllabus }, "Syllabus retrieved successfully")
      );
  });

  createSyllabus = asyncHandler(async (req, res) => {
    const syllabus = await adminService.createSyllabus(req.body, req.user._id);

    res
      .status(201)
      .json(
        new ApiResponse(201, { syllabus }, "Syllabus created successfully")
      );
  });

  updateSyllabus = asyncHandler(async (req, res) => {
    const { syllabusId } = req.params;
    const updateData = req.body;

    const updatedSyllabus = await adminService.updateSyllabus(
      syllabusId,
      updateData
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus: updatedSyllabus },
          "Syllabus updated successfully"
        )
      );
  });

  deleteSyllabus = asyncHandler(async (req, res) => {
    const { syllabusId } = req.params;

    await adminService.deleteSyllabus(syllabusId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Syllabus deleted successfully"));
  });

  toggleSyllabusActive = asyncHandler(async (req, res) => {
    const { syllabusId } = req.params;

    const updatedSyllabus = await adminService.toggleSyllabusActive(syllabusId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus: updatedSyllabus },
          "Syllabus active status toggled successfully"
        )
      );
  });

  getSyllabiByClassLevel = asyncHandler(async (req, res) => {
    const { classLevel } = req.params;

    const syllabi = await adminService.getSyllabiByClassLevel(classLevel);

    res
      .status(200)
      .json(
        new ApiResponse(200, { syllabi }, "Syllabi retrieved successfully")
      );
  });

  getActiveSyllabus = asyncHandler(async (req, res) => {
    const { classLevel } = req.params;

    const syllabus = await adminService.getActiveSyllabus(classLevel);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus },
          "Active syllabus retrieved successfully"
        )
      );
  });

  bulkUpdateSyllabi = asyncHandler(async (req, res) => {
    const { syllabusIds, updates } = req.body;

    const result = await adminService.bulkUpdateSyllabi(syllabusIds, updates);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Syllabi updated successfully"));
  });

  // Add subject to existing syllabus
  addSubjectToSyllabus = asyncHandler(async (req, res) => {
    const { syllabusId } = req.params;
    const { name, chapters } = req.body;

    const updatedSyllabus = await adminService.addSubjectToSyllabus(
      syllabusId,
      {
        name,
        chapters: chapters || [],
      }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus: updatedSyllabus },
          "Subject added to syllabus successfully"
        )
      );
  });

  // Add chapter to existing subject in syllabus
  addChapterToSubject = asyncHandler(async (req, res) => {
    const { syllabusId, subjectName } = req.params;
    const { title, topics, description } = req.body;

    const updatedSyllabus = await adminService.addChapterToSubject(
      syllabusId,
      subjectName,
      {
        title,
        topics: topics || [],
        description,
      }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus: updatedSyllabus },
          "Chapter added to subject successfully"
        )
      );
  });

  // Delete chapter from subject in syllabus
  deleteChapterFromSubject = asyncHandler(async (req, res) => {
    const { syllabusId, subjectName, chapterTitle } = req.params;

    const updatedSyllabus = await adminService.deleteChapterFromSubject(
      syllabusId,
      subjectName,
      chapterTitle
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { syllabus: updatedSyllabus },
          "Chapter deleted from subject successfully"
        )
      );
  });
}

export const adminController = new AdminController();
