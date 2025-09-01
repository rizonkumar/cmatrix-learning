import { Enrollment } from "../models/enrollment.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

class EnrollmentService {
  async enrollInCourse(studentId, courseId) {
    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (!course.isPublished) {
      throw new ApiError(400, "Course is not available for enrollment");
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      throw new ApiError(409, "Student is already enrolled in this course");
    }

    // Check if student exists and is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      throw new ApiError(400, "Invalid student");
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      isCompleted: false,
      enrolledAt: new Date(),
    });

    // Add student to course's enrolled students
    await Course.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: studentId },
    });

    return enrollment;
  }

  async unenrollFromCourse(studentId, courseId) {
    const enrollment = await Enrollment.findOneAndDelete({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    // Remove student from course's enrolled students
    await Course.findByIdAndUpdate(courseId, {
      $pull: { enrolledStudents: studentId },
    });

    return enrollment;
  }

  async updateProgress(studentId, courseId, lessonId, completed = true) {
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    // Get course to calculate progress
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Calculate total lessons
    const totalLessons = course.modules.reduce((total, module) => {
      return total + module.lessons.length;
    }, 0);

    if (completed && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    } else if (!completed && enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId.toString()
      );
    }

    // Calculate progress percentage
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    } else {
      enrollment.isCompleted = false;
      enrollment.completedAt = null;
    }

    await enrollment.save();
    return enrollment;
  }

  async getStudentEnrollments(studentId, page = 1, limit = 10) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "username fullName avatar",
        },
      })
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalEnrollments = await Enrollment.countDocuments({
      student: studentId,
    });
    const totalPages = Math.ceil(totalEnrollments / parseInt(limit));

    return {
      enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEnrollments,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async getCourseEnrollments(courseId, page = 1, limit = 10) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "username fullName avatar email")
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalEnrollments = await Enrollment.countDocuments({
      course: courseId,
    });
    const totalPages = Math.ceil(totalEnrollments / parseInt(limit));

    return {
      enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEnrollments,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async getEnrollmentById(enrollmentId) {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student", "username fullName avatar email")
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "username fullName avatar",
        },
      });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    return enrollment;
  }

  async getStudentProgress(studentId, courseId) {
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    return {
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      isCompleted: enrollment.isCompleted,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
    };
  }
}

export const enrollmentService = new EnrollmentService();
