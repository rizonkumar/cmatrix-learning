import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

// Create uploads directory if it doesn't exist
const createUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    // Determine upload path based on file type
    if (file.fieldname === "avatar") {
      uploadPath += "avatars/";
    } else if (file.fieldname === "thumbnail") {
      uploadPath += "thumbnails/";
    } else if (file.fieldname === "courseContent") {
      uploadPath += "course-content/";
    } else {
      uploadPath += "misc/";
    }

    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    avatar: /jpeg|jpg|png|gif|webp/,
    thumbnail: /jpeg|jpg|png|gif|webp/,
    courseContent:
      /jpeg|jpg|png|gif|webp|pdf|mp4|avi|mkv|mov|doc|docx|ppt|pptx/,
  };

  const fieldName = file.fieldname;
  const allowedType = allowedTypes[fieldName];

  if (!allowedType) {
    return cb(new ApiError(400, `Invalid field name: ${fieldName}`), false);
  }

  // Check MIME type
  const mimetype = allowedType.test(file.mimetype);

  // Check file extension
  const extname = allowedType.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(
      new ApiError(
        400,
        `Invalid file type for ${fieldName}. Allowed types: ${allowedType}`
      ),
      false
    );
  }
};

// Configure multer upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file) => {
      // Different size limits based on file type
      if (file.fieldname === "avatar") {
        return 5 * 1024 * 1024; // 5MB for avatars
      } else if (file.fieldname === "thumbnail") {
        return 10 * 1024 * 1024; // 10MB for thumbnails
      } else if (file.fieldname === "courseContent") {
        return 500 * 1024 * 1024; // 500MB for course content
      }
      return 10 * 1024 * 1024; // 10MB default
    },
  },
});

// Single file upload configurations
export const uploadAvatar = upload.single("avatar");
export const uploadThumbnail = upload.single("thumbnail");
export const uploadCourseContent = upload.single("courseContent");

// Multiple file upload configurations
export const uploadMultiple = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "courseContent", maxCount: 10 },
]);

// File deletion utility
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Get file info
export const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".mp4": "video/mp4",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
      ".mov": "video/quicktime",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };

    return {
      size: stats.size,
      mimeType: mimeTypes[extension] || "application/octet-stream",
      extension: extension,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    console.error("Error getting file info:", error);
    return null;
  }
};

// Validate file before processing
export const validateFile = (file, fieldName) => {
  const errors = [];

  if (!file) {
    errors.push(`${fieldName} is required`);
    return errors;
  }

  // Check file size
  const maxSizes = {
    avatar: 5 * 1024 * 1024, // 5MB
    thumbnail: 10 * 1024 * 1024, // 10MB
    courseContent: 500 * 1024 * 1024, // 500MB
  };

  if (file.size > maxSizes[fieldName]) {
    errors.push(`${fieldName} file size exceeds limit`);
  }

  // Check file type
  const allowedTypes = {
    avatar: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    thumbnail: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    courseContent: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "video/mp4",
      "video/x-msvideo",
      "video/x-matroska",
      "video/quicktime",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  };

  if (!allowedTypes[fieldName].includes(file.mimetype)) {
    errors.push(`Invalid file type for ${fieldName}`);
  }

  return errors;
};
