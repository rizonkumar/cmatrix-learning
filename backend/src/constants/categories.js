/**
 * Course Categories Constants
 * 
 * This file contains all the valid course categories used throughout the application.
 * Using constants improves code maintainability and reduces the risk of typos.
 */

// Course categories for validation and enum usage
export const COURSE_CATEGORIES = [
  "CBSE Class 8",
  "CBSE Class 9", 
  "CBSE Class 10",
  "CBSE Class 11",
  "CBSE Class 12",
  "NEET",
  "IIT-JEE",
];

// Syllabus class levels (used in syllabus management)
export const CLASS_LEVELS = [
  "8th",
  "9th",
  "10th", 
  "11th",
  "12th",
  "JEE Main",
  "JEE Advanced",
  "NEET",
];

// Course difficulty levels
export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate", 
  "advanced",
];

// Content types for lessons
export const CONTENT_TYPES = [
  "video",
  "pdf",
  "text",
];

// User roles
export const USER_ROLES = [
  "student",
  "teacher",
  "admin",
];

// Helper functions for validation
export const isValidCategory = (category) => COURSE_CATEGORIES.includes(category);
export const isValidClassLevel = (classLevel) => CLASS_LEVELS.includes(classLevel);
export const isValidDifficulty = (difficulty) => DIFFICULTY_LEVELS.includes(difficulty);
export const isValidContentType = (contentType) => CONTENT_TYPES.includes(contentType);
export const isValidUserRole = (role) => USER_ROLES.includes(role);

// Error messages
export const VALIDATION_MESSAGES = {
  INVALID_CATEGORY: `Invalid category. Must be one of: ${COURSE_CATEGORIES.join(", ")}`,
  INVALID_CLASS_LEVEL: `Invalid class level. Must be one of: ${CLASS_LEVELS.join(", ")}`,
  INVALID_DIFFICULTY: `Invalid difficulty. Must be one of: ${DIFFICULTY_LEVELS.join(", ")}`,
  INVALID_CONTENT_TYPE: `Invalid contentType. Must be one of: ${CONTENT_TYPES.join(", ")}`,
  INVALID_USER_ROLE: `Invalid user role. Must be one of: ${USER_ROLES.join(", ")}`,
};
