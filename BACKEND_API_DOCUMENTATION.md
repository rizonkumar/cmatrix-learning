# C-Matrix Learning Backend API Documentation

## Overview

C-Matrix Learning is a comprehensive e-learning platform backend API built with Node.js, Express, and MongoDB. This API provides secure authentication, course management, user profiles, todos, kanban boards, enrollment tracking, and learning progress management.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All protected routes require JWT authentication. You can authenticate using:

### Headers
```
Authorization: Bearer <access_token>
```

### Cookies
The API automatically handles authentication via `accessToken` and `refreshToken` cookies.

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cmatrix.com` | `Admin123!` |
| Teacher | `emily.johnson@example.com` | `Password123!` |
| Student | `john.doe@example.com` | `Password123!` |

## Rate Limiting

- **100 requests per 15 minutes** per IP address
- Headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

# 🏥 System Health & Utility Endpoints

## Health Check

```http
GET /
```

**Response:**
```json
{
  "success": true,
  "message": "C-Matrix Learning API is running successfully",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

# 📁 File Upload Endpoints

## Upload Avatar

```http
POST /users/avatar
```

**Content-Type:** `multipart/form-data`
**Form Data:**
- `avatar`: Image file (JPEG, PNG, GIF, WebP) - Max 5MB

**Requires:** Authentication

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "/uploads/avatars/avatar-1234567890.jpg",
    "fileName": "avatar-1234567890.jpg",
    "fileSize": 245760
  }
}
```

## Upload Course Thumbnail

```http
POST /courses/thumbnail
```

**Content-Type:** `multipart/form-data`
**Form Data:**
- `thumbnail`: Image file (JPEG, PNG, GIF, WebP) - Max 10MB

**Requires:** Authentication (Teacher/Admin)

**Response:**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "thumbnailUrl": "/uploads/thumbnails/thumbnail-1234567890.jpg",
    "fileName": "thumbnail-1234567890.jpg",
    "fileSize": 5242880
  }
}
```

## Upload Course Content

```http
POST /courses/content
```

**Content-Type:** `multipart/form-data`
**Form Data:**
- `courseContent`: File (PDF, MP4, AVI, MKV, MOV, DOC, DOCX, PPT, PPTX) - Max 500MB

**Requires:** Authentication (Teacher/Admin)

**Response:**
```json
{
  "success": true,
  "message": "Content uploaded successfully",
  "data": {
    "contentUrl": "/uploads/course-content/lesson-1234567890.pdf",
    "fileName": "lesson-1234567890.pdf",
    "fileSize": 10485760,
    "fileType": "application/pdf"
  }
}
```

## Multiple File Upload

```http
POST /upload/multiple
```

**Content-Type:** `multipart/form-data`
**Form Data:**
- `avatar`: Image file (optional)
- `thumbnail`: Image file (optional)
- `courseContent[]`: Multiple files (optional)

**Requires:** Authentication

---

# 🔐 Authentication Endpoints

## Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "Password123!",
  "role": "student"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "student",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      "currentStreak": 0,
      "longestStreak": 0,
      "isEmailVerified": false,
      "lastLogin": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    "Email already exists",
    "Password must be at least 8 characters long"
  ]
}
```

## Login User

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

## Logout User

```http
POST /auth/logout
```

**Requires:** Authentication

## Refresh Token

```http
POST /auth/refresh-token
```

## Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

## Reset Password

```http
POST /auth/reset-password
```

**Request Body:**

```json
{
  "token": "reset-token-here",
  "newPassword": "NewPassword123!"
}
```

## Change Password

```http
POST /auth/change-password
```

**Request Body:**

```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

# 👥 User Management Endpoints

## Get Current User Profile

```http
GET /users/profile
```

**Requires:** Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "student",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      "currentStreak": 5,
      "longestStreak": 12,
      "lastLogin": "2024-01-15T08:30:00.000Z",
      "isEmailVerified": true,
      "totalEnrolledCourses": 8,
      "completedCourses": 3,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Update User Profile

```http
PUT /users/profile
```

**Request Body:**

```json
{
  "fullName": "John Doe Updated",
  "avatar": "https://example.com/new-avatar.jpg",
  "bio": "Passionate learner interested in Mathematics and Physics"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe Updated",
      "bio": "Passionate learner interested in Mathematics and Physics",
      "avatar": "https://example.com/new-avatar.jpg"
    }
  }
}
```

## Get User Statistics

```http
GET /users/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEnrolledCourses": 8,
      "completedCourses": 3,
      "inProgressCourses": 5,
      "totalLearningHours": 45,
      "currentStreak": 5,
      "longestStreak": 12,
      "averageRating": 4.2,
      "totalReviews": 6,
      "achievements": [
        {
          "id": "first_course_completed",
          "title": "First Course Completed",
          "description": "Complete your first course",
          "unlockedAt": "2024-01-10T00:00:00.000Z"
        }
      ]
    }
  }
}
```

## Update Learning Streak

```http
POST /users/streak
```

**Request Body:**
```json
{
  "activityType": "lesson_completed",
  "courseId": "507f1f77bcf86cd799439012"
}
```

## Delete Account

```http
DELETE /users/delete-account
```

**Request Body:**
```json
{
  "reason": "No longer need the account",
  "confirmPassword": "Password123!"
}
```

## Get All Users (Admin Only)

```http
GET /users/all?page=1&limit=10&role=student&search=john&isActive=true
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (student, teacher, admin)
- `search`: Search in name, email, username
- `isActive`: Filter by active status
- `sortBy`: Sort by (createdAt, lastLogin, fullName)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "role": "student",
        "isActive": true,
        "lastLogin": "2024-01-15T08:30:00.000Z",
        "enrolledCoursesCount": 8,
        "completedCoursesCount": 3,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 47,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Update User Role (Admin Only)

```http
PUT /users/:userId/role
```

**Request Body:**

```json
{
  "role": "teacher",
  "reason": "User has been approved as a teacher"
}
```

## Deactivate User (Admin Only)

```http
PATCH /users/:userId/deactivate
```

**Request Body:**
```json
{
  "reason": "Violation of terms of service"
}
```

## Get User Details (Admin Only)

```http
GET /users/:userId/details
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "student",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      "bio": "Mathematics enthusiast",
      "currentStreak": 5,
      "longestStreak": 12,
      "totalEnrolledCourses": 8,
      "completedCourses": 3,
      "averageRating": 4.2,
      "lastLogin": "2024-01-15T08:30:00.000Z",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "enrolledCourses": [...],
    "recentActivity": [...]
  }
}
```

---

# 📚 Course Management Endpoints

## Get All Courses

```http
GET /courses?page=1&limit=12&category=CBSE%20Class%2010&search=physics&priceMin=0&priceMax=1000
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category
- `subject`: Search in title
- `search`: General search
- `priceMin`, `priceMax`: Price range filter
- `isPublished`: Publication status (default: true)

**Response:**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "...",
        "title": "Physics Class 10",
        "description": "...",
        "category": "CBSE Class 10",
        "teacher": {
          "username": "teacher1",
          "fullName": "John Smith"
        },
        "rating": 4.5,
        "reviewCount": 25,
        "price": 499,
        "isEnrolled": false,
        "enrollmentProgress": 0
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCourses": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Get Course by ID

```http
GET /courses/:courseId
```

## Search Courses

```http
GET /courses/search?q=physics&page=1&limit=10
```

## Get Courses by Category

```http
GET /courses/category/:category?page=1&limit=10
```

## Get Featured Courses

```http
GET /courses/featured?limit=6
```

## Get Course Categories

```http
GET /courses/categories
```

---

# 👑 Admin Course Management

## Create Course (Admin Only)

```http
POST /admin/courses
```

**Requires:** Admin Authentication

**Request Body:**

```json
{
  "title": "Physics Class 10",
  "description": "Complete Physics syllabus for CBSE Class 10",
  "category": "CBSE Class 10",
  "teacher": "teacher_id_here",
  "modules": [
    {
      "title": "Electricity",
      "lessons": [
        { "title": "Electric Current", "contentType": "video", "order": 1 },
        { "title": "Electric Potential", "contentType": "video", "order": 2 }
      ]
    }
  ],
  "price": 499,
  "isPublished": true,
  "difficulty": "intermediate"
}
```

## Update Course (Admin Only)

```http
PUT /admin/courses/:courseId
```

## Delete Course (Admin Only)

```http
DELETE /admin/courses/:courseId
```

## Publish/Unpublish Course (Admin Only)

```http
PATCH /admin/courses/:courseId/publish
```

**Request Body:**

```json
{
  "isPublished": true
}
```

## Bulk Operations (Admin Only)

```http
PATCH /admin/courses/bulk-update
```

**Request Body:**

```json
{
  "courseIds": ["course_id_1", "course_id_2"],
  "updates": { "isPublished": false }
}
```

## Course Statistics (Admin Only)

```http
GET /admin/stats/courses
```

## Teacher Management (Admin Only)

```http
GET /admin/teachers
```

---

# 📝 Enrollment Management

## Enroll in Course

```http
POST /enrollments/courses/:courseId/enroll
```

**Requires:** Authentication

## Unenroll from Course

```http
DELETE /enrollments/courses/:courseId/unenroll
```

## Update Lesson Progress

```http
PATCH /enrollments/courses/:courseId/lessons/:lessonId/progress
```

**Request Body:**

```json
{
  "completed": true
}
```

## Get My Enrollments

```http
GET /enrollments/my-enrollments?page=1&limit=10
```

## Get Enrollment Details

```http
GET /enrollments/:enrollmentId
```

## Check Enrollment Status

```http
GET /enrollments/courses/:courseId/status
```

## Get Course Progress

```http
GET /enrollments/courses/:courseId/progress
```

## Get Course Enrollments (Teacher/Admin)

```http
GET /enrollments/courses/:courseId/enrollments?page=1&limit=10
```

---

# ✅ TODO Management

## Create Todo

```http
POST /todos
```

**Request Body:**

```json
{
  "taskDescription": "Complete Physics homework",
  "priority": "high",
  "dueDate": "2024-02-15T10:00:00Z"
}
```

## Get My Todos

```http
GET /todos?page=1&limit=10&isCompleted=false&priority=high&search=physics
```

## Update Todo

```http
PUT /todos/:todoId
```

## Delete Todo

```http
DELETE /todos/:todoId
```

## Toggle Completion Status

```http
PATCH /todos/:todoId/toggle
```

## Bulk Update Todos

```http
PATCH /todos/bulk/update
```

**Request Body:**

```json
{
  "todoIds": ["todo_id_1", "todo_id_2"],
  "updates": { "priority": "medium" }
}
```

## Bulk Delete Todos

```http
DELETE /todos/bulk/delete
```

**Request Body:**

```json
{
  "todoIds": ["todo_id_1", "todo_id_2"]
}
```

## Get Todo Statistics

```http
GET /todos/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 25,
      "completed": 15,
      "pending": 10,
      "highPriority": 5,
      "urgent": 2,
      "overdue": 1
    }
  }
}
```

## Get Upcoming Todos

```http
GET /todos/upcoming?limit=5
```

---

# 📋 Kanban Board Management

## Create Board

```http
POST /kanban/boards
```

**Request Body:**

```json
{
  "title": "Physics Study Plan",
  "description": "Weekly study plan for Physics"
}
```

## Get My Boards

```http
GET /kanban/boards
```

## Get Board Details

```http
GET /kanban/boards/:boardId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "board": {
      "_id": "...",
      "title": "Physics Study Plan",
      "description": "...",
      "owner": {...}
    },
    "columns": [
      {
        "_id": "...",
        "title": "To Do",
        "order": 0,
        "cards": [...]
      }
    ]
  }
}
```

## Update Board

```http
PUT /kanban/boards/:boardId
```

## Delete Board

```http
DELETE /kanban/boards/:boardId
```

## Create Column

```http
POST /kanban/boards/:boardId/columns
```

**Request Body:**

```json
{
  "title": "In Progress",
  "color": "#3498db"
}
```

## Update Column

```http
PUT /kanban/columns/:columnId
```

## Delete Column

```http
DELETE /kanban/columns/:columnId
```

## Reorder Columns

```http
PATCH /kanban/boards/:boardId/columns/reorder
```

**Request Body:**

```json
{
  "columnOrder": ["column_id_1", "column_id_2", "column_id_3"]
}
```

## Create Card

```http
POST /kanban/columns/:columnId/cards
```

**Request Body:**

```json
{
  "title": "Complete Chapter 5",
  "description": "Solve all exercises in Chapter 5",
  "priority": "high",
  "dueDate": "2024-02-15T10:00:00Z",
  "assignedTo": "user_id_here"
}
```

## Update Card

```http
PUT /kanban/cards/:cardId
```

## Delete Card

```http
DELETE /kanban/cards/:cardId
```

## Move Card

```http
PATCH /kanban/cards/:cardId/move
```

**Request Body:**

```json
{
  "newColumnId": "column_id_here",
  "newOrder": 2
}
```

## Reorder Cards

```http
PATCH /kanban/columns/:columnId/cards/reorder
```

**Request Body:**

```json
{
  "cardOrder": ["card_id_1", "card_id_2", "card_id_3"]
}
```

## Get Board Statistics

```http
GET /kanban/boards/:boardId/stats
```

---

# ⭐ Review & Rating System

## Create Review

```http
POST /reviews/courses/:courseId/reviews
```

**Requires:** Authentication, Course Completion

**Request Body:**

```json
{
  "rating": 5,
  "title": "Excellent Course",
  "comment": "Very comprehensive and well-structured content"
}
```

## Get Course Reviews

```http
GET /reviews/courses/:courseId/reviews?page=1&limit=10&sortBy=newest
```

**Sort Options:** `newest`, `oldest`, `highest`, `lowest`, `helpful`

## Get Review Statistics

```http
GET /reviews/courses/:courseId/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "averageRating": 4.3,
      "totalReviews": 25,
      "verifiedReviews": 20,
      "ratingDistribution": {
        "1": 1,
        "2": 0,
        "3": 3,
        "4": 8,
        "5": 13
      }
    }
  }
}
```

## Update Review

```http
PUT /reviews/:reviewId
```

## Delete Review

```http
DELETE /reviews/:reviewId
```

## Mark Review Helpful

```http
POST /reviews/:reviewId/helpful
```

## Report Review

```http
POST /reviews/:reviewId/report
```

**Request Body:**

```json
{
  "reason": "Inappropriate content"
}
```

## Get My Reviews

```http
GET /reviews/my-reviews?page=1&limit=10
```

## Admin Review Management

```http
GET /reviews/admin/all?page=1&limit=20&isApproved=false
PATCH /reviews/admin/:reviewId/approve
PATCH /reviews/admin/:reviewId/reject
```

---

# 🛠️ Utility Endpoints

## Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "C-Matrix Learning API is running successfully",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

# 📊 Error Handling

All API responses follow a consistent format:

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"]
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

# 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Role-Based Access Control** (Student, Teacher, Admin)
- **Password Hashing** with bcrypt
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** and sanitization
- **CORS Protection**
- **Helmet.js** security headers
- **XSS Protection**

---

# 📋 Data Models

## Course Categories

- `CBSE Class 8`, `CBSE Class 9`, `CBSE Class 10`
- `CBSE Class 11`, `CBSE Class 12`
- `NEET`, `IIT-JEE`

## Priority Levels

- `low`, `medium`, `high`, `urgent`

## Content Types

- `video`, `pdf`, `text`, `quiz`

## Difficulty Levels

- `beginner`, `intermediate`, `advanced`

---

# 🚀 Getting Started

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Seed the database:**

   ```bash
   npm run seed
   ```

3. **Access the API:**
   ```
   http://localhost:8000/api/v1
   ```

This comprehensive API provides everything needed to build a full-featured e-learning platform with course management, user progress tracking, productivity tools, and administrative controls.
