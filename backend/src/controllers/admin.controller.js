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
}

export const adminController = new AdminController();
