import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import courseRoutes from "./course.routes.js";
import adminRoutes from "./admin.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import todoRoutes from "./todo.routes.js";
import kanbanRoutes from "./kanban.routes.js";
import reviewRoutes from "./review.routes.js";
// import wishlistRoutes from "./wishlist.routes.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadAvatarSingle,
  uploadThumbnailSingle,
  uploadCourseContentSingle,
  uploadMultiple,
} from "../services/fileUpload.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

const API_VERSION = "/api/v1";

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "C-Matrix Learning API is running successfully",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// File upload routes
router.post(
  `${API_VERSION}/users/avatar`,
  verifyJWT,
  uploadAvatarSingle,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, {}, "No file uploaded"));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          avatarUrl: req.file.path,
          fileName: req.file.filename,
          size: req.file.size,
        },
        "Avatar uploaded successfully"
      )
    );
  }
);

router.post(
  `${API_VERSION}/courses/thumbnail`,
  verifyJWT,
  uploadThumbnailSingle,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, {}, "No file uploaded"));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          thumbnailUrl: req.file.path,
          fileName: req.file.filename,
          size: req.file.size,
        },
        "Thumbnail uploaded successfully"
      )
    );
  }
);

router.post(
  `${API_VERSION}/courses/content`,
  verifyJWT,
  uploadCourseContentSingle,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, {}, "No file uploaded"));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          contentUrl: req.file.path,
          fileName: req.file.filename,
          size: req.file.size,
          fileType: req.file.mimetype,
        },
        "Content uploaded successfully"
      )
    );
  }
);

router.post(
  `${API_VERSION}/upload/multiple`,
  verifyJWT,
  uploadMultiple,
  (req, res) => {
    const uploadedFiles = {};

    if (req.files.avatar && req.files.avatar[0]) {
      uploadedFiles.avatar = {
        url: req.files.avatar[0].path,
        filename: req.files.avatar[0].filename,
        size: req.files.avatar[0].size,
      };
    }

    if (req.files.thumbnail && req.files.thumbnail[0]) {
      uploadedFiles.thumbnail = {
        url: req.files.thumbnail[0].path,
        filename: req.files.thumbnail[0].filename,
        size: req.files.thumbnail[0].size,
      };
    }

    if (req.files.courseContent && req.files.courseContent.length > 0) {
      uploadedFiles.courseContent = req.files.courseContent.map((file) => ({
        url: file.path,
        filename: file.filename,
        size: file.size,
        type: file.mimetype,
      }));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          uploadedFiles,
        },
        "Files uploaded successfully"
      )
    );
  }
);

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/courses`, courseRoutes);
router.use(`${API_VERSION}/admin`, adminRoutes);
router.use(`${API_VERSION}/enrollments`, enrollmentRoutes);
router.use(`${API_VERSION}/todos`, todoRoutes);
router.use(`${API_VERSION}/kanban`, kanbanRoutes);
router.use(`${API_VERSION}/reviews`, reviewRoutes);
// router.use(`${API_VERSION}/wishlist`, wishlistRoutes);

export default router;
