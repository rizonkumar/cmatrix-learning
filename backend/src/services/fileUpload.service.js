import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import { createCloudinaryStorage } from "../config/cloudinary.js";

const createUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createStorageForField = (fieldName) => {
  let folder = "misc";

  if (fieldName === "avatar") {
    folder = "avatars";
  } else if (fieldName === "thumbnail") {
    folder = "thumbnails";
  } else if (fieldName === "courseContent") {
    folder = "course-content";
  }

  return createCloudinaryStorage(folder);
};

const avatarStorage = createStorageForField("avatar");
const thumbnailStorage = createStorageForField("thumbnail");
const courseContentStorage = createStorageForField("courseContent");
const miscStorage = createCloudinaryStorage("misc");

const fileFilter = (req, file, cb) => {
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

  const mimetype = allowedType.test(file.mimetype);

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

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadCourseContent = multer({
  storage: courseContentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

export const uploadMisc = multer({
  storage: miscStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadAvatarSingle = uploadAvatar.single("avatar");
export const uploadThumbnailSingle = uploadThumbnail.single("thumbnail");
export const uploadCourseContentSingle =
  uploadCourseContent.single("courseContent");

export const uploadMultiple = multer({
  storage: miscStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "courseContent", maxCount: 10 },
]);

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

export const validateFile = (file, fieldName) => {
  const errors = [];

  if (!file) {
    errors.push(`${fieldName} is required`);
    return errors;
  }

  const maxSizes = {
    avatar: 5 * 1024 * 1024,
    thumbnail: 10 * 1024 * 1024,
    courseContent: 500 * 1024 * 1024,
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
