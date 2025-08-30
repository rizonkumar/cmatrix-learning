# C-Matrix Learning API - Postman Testing Guide

## 📋 Overview

This guide provides a comprehensive testing suite for the C-Matrix Learning API using Postman. It includes environment setup, authentication workflows, and complete test collections for all endpoints.

## 🚀 Quick Start

### Prerequisites

- Postman installed
- C-Matrix Learning backend server running on `http://localhost:8000`
- Database seeded with sample data

### Environment Setup

#### 1. Create Postman Environment

Create a new environment in Postman named "C-Matrix Learning" with the following variables:

```json
{
  "base_url": "http://localhost:8000/api/v1",
  "access_token": "",
  "refresh_token": "",
  "user_id": "",
  "course_id": "",
  "todo_id": "",
  "board_id": "",
  "review_id": "",
  "admin_email": "admin@cmatrix.com",
  "admin_password": "Admin123!",
  "teacher_email": "emily.johnson@example.com",
  "teacher_password": "Password123!",
  "student_email": "john.doe@example.com",
  "student_password": "Password123!"
}
```

## 🔐 Authentication Workflow

### 1. Health Check

```http
GET {{base_url}}/../health
```

### 2. Register New User (Optional)

```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "password": "Password123!",
  "role": "student"
}
```

### 3. Login as Admin

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{admin_email}}",
  "password": "{{admin_password}}"
}
```

**Test Script (Add to Tests tab):**

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("access_token", response.data.accessToken);
  pm.environment.set("refresh_token", response.data.refreshToken);
  pm.environment.set("user_id", response.data.user._id);
}
```

### 4. Login as Teacher

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{teacher_email}}",
  "password": "{{teacher_password}}"
}
```

### 5. Login as Student

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{student_email}}",
  "password": "{{student_password}}"
}
```

## 📁 Complete Postman Collection Structure

### Folder Organization

```
📦 C-Matrix Learning API Testing
├── 🔐 Authentication
│   ├── Health Check
│   ├── Register User
│   ├── Login (Admin)
│   ├── Login (Teacher)
│   ├── Login (Student)
│   ├── Logout
│   ├── Refresh Token
│   ├── Forgot Password
│   ├── Reset Password
│   ├── Change Password
│   └── Delete Account
├── 👤 User Management
│   ├── Get Profile
│   ├── Update Profile
│   ├── Get Statistics
│   ├── Update Streak
│   ├── Get All Users (Admin)
│   ├── Update User Role (Admin)
│   ├── Deactivate User (Admin)
│   └── Get User Details (Admin)
├── 📚 Course Management
│   ├── Get All Courses
│   ├── Get Course by ID
│   ├── Search Courses
│   ├── Get by Category
│   ├── Get Featured Courses
│   ├── Get Categories
│   ├── Create Course (Admin)
│   ├── Update Course (Admin)
│   ├── Delete Course (Admin)
│   ├── Publish Course (Admin)
│   ├── Bulk Update (Admin)
│   ├── Course Statistics (Admin)
│   └── Get Teachers (Admin)
├── 📝 Enrollment Management
│   ├── Enroll in Course
│   ├── Unenroll from Course
│   ├── Update Lesson Progress
│   ├── Get My Enrollments
│   ├── Get Enrollment Details
│   ├── Check Enrollment Status
│   ├── Get Course Progress
│   └── Get Course Enrollments (Teacher)
├── ✅ TODO Management
│   ├── Create Todo
│   ├── Get My Todos
│   ├── Update Todo
│   ├── Delete Todo
│   ├── Toggle Completion
│   ├── Bulk Update Todos
│   ├── Bulk Delete Todos
│   ├── Get Statistics
│   └── Get Upcoming Todos
├── 📋 Kanban Board Management
│   ├── Create Board
│   ├── Get My Boards
│   ├── Get Board Details
│   ├── Update Board
│   ├── Delete Board
│   ├── Create Column
│   ├── Update Column
│   ├── Delete Column
│   ├── Reorder Columns
│   ├── Create Card
│   ├── Update Card
│   ├── Delete Card
│   ├── Move Card
│   ├── Reorder Cards
│   └── Get Board Statistics
├── ⭐ Review & Rating System
│   ├── Create Review
│   ├── Get Course Reviews
│   ├── Get Review Statistics
│   ├── Update Review
│   ├── Delete Review
│   ├── Mark Review Helpful
│   ├── Report Review
│   ├── Get My Reviews
│   ├── Get All Reviews (Admin)
│   ├── Approve Review (Admin)
│   └── Reject Review (Admin)
├── 📁 File Upload
│   ├── Upload Avatar
│   ├── Upload Course Thumbnail
│   ├── Upload Course Content
│   └── Multiple File Upload
└── 🧪 Automated Tests
    ├── Full Authentication Flow
    ├── Complete User Workflow
    ├── Course Enrollment Flow
    └── Admin Management Flow
```

## 📋 Detailed Endpoint Testing

### Common Headers

Add these headers to all authenticated requests:

```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "fullName": "New User",
  "password": "Password123!",
  "role": "student"
}
```

### Login

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "{{student_email}}",
  "password": "{{student_password}}"
}
```

### Logout

```http
POST {{base_url}}/auth/logout
Authorization: Bearer {{access_token}}
```

### Refresh Token

```http
POST {{base_url}}/auth/refresh-token
Authorization: Bearer {{access_token}}
```

### Change Password

```http
POST {{base_url}}/auth/change-password
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "oldPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

---

## 👤 User Management Endpoints

### Get User Profile

```http
GET {{base_url}}/users/profile
Authorization: Bearer {{access_token}}
```

### Update Profile

```http
PUT {{base_url}}/users/profile
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "bio": "Updated bio description"
}
```

### Update Learning Streak

```http
POST {{base_url}}/users/streak
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "activityType": "lesson_completed",
  "courseId": "{{course_id}}"
}
```

### Get All Users (Admin)

```http
GET {{base_url}}/users/all?page=1&limit=10&role=student&search=john
Authorization: Bearer {{access_token}}
```

### Update User Role (Admin)

```http
PUT {{base_url}}/users/{{user_id}}/role
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "role": "teacher",
  "reason": "Approved as teacher"
}
```

---

## 📚 Course Management Endpoints

### Get All Courses

```http
GET {{base_url}}/courses?page=1&limit=12&category=CBSE%20Class%2010&search=physics
Authorization: Bearer {{access_token}}
```

### Get Course by ID

```http
GET {{base_url}}/courses/{{course_id}}
Authorization: Bearer {{access_token}}
```

### Search Courses

```http
GET {{base_url}}/courses/search?q=physics&page=1&limit=10
Authorization: Bearer {{access_token}}
```

### Create Course (Admin)

```http
POST {{base_url}}/admin/courses
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Advanced Mathematics",
  "description": "Complete Mathematics course for advanced learners",
  "category": "CBSE Class 12",
  "teacher": "{{user_id}}",
  "modules": [
    {
      "title": "Calculus",
      "lessons": [
        {
          "title": "Limits and Continuity",
          "contentType": "video",
          "order": 1
        }
      ]
    }
  ],
  "price": 999,
  "isPublished": true,
  "difficulty": "advanced"
}
```

### Update Course (Admin)

```http
PUT {{base_url}}/admin/courses/{{course_id}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 799
}
```

### Publish/Unpublish Course (Admin)

```http
PATCH {{base_url}}/admin/courses/{{course_id}}/publish
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "isPublished": false
}
```

---

## 📝 Enrollment Management Endpoints

### Enroll in Course

```http
POST {{base_url}}/enrollments/courses/{{course_id}}/enroll
Authorization: Bearer {{access_token}}
```

### Update Lesson Progress

```http
PATCH {{base_url}}/enrollments/courses/{{course_id}}/lessons/lesson_id/progress
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "completed": true
}
```

### Get My Enrollments

```http
GET {{base_url}}/enrollments/my-enrollments?page=1&limit=10
Authorization: Bearer {{access_token}}
```

### Get Course Progress

```http
GET {{base_url}}/enrollments/courses/{{course_id}}/progress
Authorization: Bearer {{access_token}}
```

---

## ✅ TODO Management Endpoints

### Create Todo

```http
POST {{base_url}}/todos
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "taskDescription": "Complete Physics assignment",
  "priority": "high",
  "dueDate": "2024-02-15T10:00:00Z"
}
```

### Get My Todos

```http
GET {{base_url}}/todos?page=1&limit=10&isCompleted=false&priority=high
Authorization: Bearer {{access_token}}
```

### Update Todo

```http
PUT {{base_url}}/todos/{{todo_id}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "taskDescription": "Updated task description",
  "priority": "medium"
}
```

### Toggle Completion Status

```http
PATCH {{base_url}}/todos/{{todo_id}}/toggle
Authorization: Bearer {{access_token}}
```

### Bulk Update Todos

```http
PATCH {{base_url}}/todos/bulk/update
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "todoIds": ["todo_id_1", "todo_id_2"],
  "updates": {
    "priority": "low",
    "isCompleted": true
  }
}
```

### Get Todo Statistics

```http
GET {{base_url}}/todos/stats
Authorization: Bearer {{access_token}}
```

---

## 📋 Kanban Board Management Endpoints

### Create Board

```http
POST {{base_url}}/kanban/boards
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Study Plan Board",
  "description": "Weekly study planning board"
}
```

### Create Column

```http
POST {{base_url}}/kanban/boards/{{board_id}}/columns
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "To Do",
  "color": "#3498db"
}
```

### Create Card

```http
POST {{base_url}}/kanban/columns/column_id/cards
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Complete Chapter 5",
  "description": "Solve all exercises in Chapter 5",
  "priority": "high",
  "dueDate": "2024-02-15T10:00:00Z"
}
```

### Move Card

```http
PATCH {{base_url}}/kanban/cards/card_id/move
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "newColumnId": "new_column_id",
  "newOrder": 1
}
```

---

## ⭐ Review & Rating System Endpoints

### Create Review

```http
POST {{base_url}}/reviews/courses/{{course_id}}/reviews
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "rating": 5,
  "title": "Excellent Course",
  "comment": "Very comprehensive and well-structured content"
}
```

### Get Course Reviews

```http
GET {{base_url}}/reviews/courses/{{course_id}}/reviews?page=1&limit=10&sortBy=newest
Authorization: Bearer {{access_token}}
```

### Update Review

```http
PUT {{base_url}}/reviews/{{review_id}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "rating": 4,
  "title": "Updated Review Title",
  "comment": "Updated review comment"
}
```

### Mark Review Helpful

```http
POST {{base_url}}/reviews/{{review_id}}/helpful
Authorization: Bearer {{access_token}}
```

---

## 📁 File Upload Endpoints

### Upload Avatar

```http
POST {{base_url}}/users/avatar
Authorization: Bearer {{access_token}}
Content-Type: multipart/form-data

Form Data:
- avatar: [Select image file]
```

### Upload Course Thumbnail

```http
POST {{base_url}}/courses/thumbnail
Authorization: Bearer {{access_token}}
Content-Type: multipart/form-data

Form Data:
- thumbnail: [Select image file]
```

### Upload Course Content

```http
POST {{base_url}}/courses/content
Authorization: Bearer {{access_token}}
Content-Type: multipart/form-data

Form Data:
- courseContent: [Select file - PDF, MP4, etc.]
```

---

## 🧪 Automated Test Scripts

### Authentication Test Script

```javascript
// Add to Tests tab in login requests
if (pm.response.code === 200) {
  const response = pm.response.json();

  // Set tokens
  pm.environment.set("access_token", response.data.accessToken);
  pm.environment.set("refresh_token", response.data.refreshToken);
  pm.environment.set("user_id", response.data.user._id);

  // Validate response structure
  pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    pm.expect(response.success).to.eql(true);
    pm.expect(response.data).to.have.property("accessToken");
    pm.expect(response.data).to.have.property("refreshToken");
    pm.expect(response.data.user).to.have.property("_id");
  });
}
```

### Response Validation Script

```javascript
// Add to Tests tab for all requests
pm.test("Response has success field", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("success");
});

pm.test("Response has message field", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("message");
});

pm.test("Response has timestamp", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("timestamp");
});

pm.test("Status code is correct", function () {
  pm.response.to.have.status(200);
});
```

### Data Extraction Script

```javascript
// Add to Tests tab where you need to extract IDs
if (pm.response.code === 200) {
  const response = pm.response.json();

  // Extract course ID
  if (response.data.courses && response.data.courses.length > 0) {
    pm.environment.set("course_id", response.data.courses[0]._id);
  }

  // Extract todo ID
  if (response.data.todos && response.data.todos.length > 0) {
    pm.environment.set("todo_id", response.data.todos[0]._id);
  }

  // Extract board ID
  if (response.data.boards && response.data.boards.length > 0) {
    pm.environment.set("board_id", response.data.boards[0]._id);
  }
}
```

---

## 🔄 Testing Workflows

### 1. Complete User Registration Flow

1. Register new user
2. Login with credentials
3. Update profile
4. Upload avatar
5. Get user statistics
6. Logout

### 2. Course Management Flow (Admin)

1. Login as admin
2. Create new course
3. Upload course thumbnail
4. Update course details
5. Publish course
6. Get course statistics

### 3. Student Learning Flow

1. Login as student
2. Browse courses
3. Enroll in course
4. Update lesson progress
5. Create review
6. Get learning statistics

### 4. Productivity Tools Flow

1. Login as student
2. Create todo items
3. Create kanban board
4. Add columns and cards
5. Move cards between columns
6. Update todo status

---

## 🚨 Error Testing Scenarios

### Authentication Errors

```javascript
// Test invalid login
POST {{base_url}}/auth/login
{
  "email": "wrong@email.com",
  "password": "wrongpassword"
}
// Expected: 401 Unauthorized

// Test expired token
GET {{base_url}}/users/profile
Authorization: Bearer expired_token
// Expected: 401 Unauthorized
```

### Validation Errors

```javascript
// Test missing required fields
POST {{base_url}}/auth/register
{
  "email": "test@example.com"
  // Missing password, username, etc.
}
// Expected: 400 Bad Request

// Test invalid email format
POST {{base_url}}/auth/register
{
  "username": "testuser",
  "email": "invalid-email",
  "password": "Password123!"
}
// Expected: 400 Bad Request
```

### Authorization Errors

```javascript
// Student trying to access admin endpoint
GET {{base_url}}/admin/stats/courses
Authorization: Bearer student_token
// Expected: 403 Forbidden
```

### Rate Limiting

```javascript
// Send multiple requests quickly
GET {{base_url}}/courses
// After 100 requests in 15 minutes
// Expected: 429 Too Many Requests
```

---

## 📊 Performance Testing

### Load Testing Setup

```javascript
// Add to Tests tab for performance monitoring
pm.test("Response time is less than 1000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Response size is reasonable", function () {
  pm.expect(pm.response.responseSize).to.be.below(1000000); // 1MB
});
```

### Collection Runner Configuration

1. Set iterations: 10-100
2. Set delay: 1000ms between requests
3. Monitor response times
4. Check for consistent success rates

---

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized**

   - Check if access token is set correctly
   - Verify token hasn't expired
   - Ensure proper Authorization header format

2. **403 Forbidden**

   - Check user role permissions
   - Verify endpoint access levels

3. **400 Bad Request**

   - Validate request body format
   - Check required fields
   - Verify data types

4. **404 Not Found**

   - Check endpoint URL
   - Verify resource IDs exist
   - Confirm API version prefix

5. **500 Internal Server Error**
   - Check server logs
   - Verify database connection
   - Ensure all dependencies are installed

### Debug Tips

- Use Postman's Console to view detailed request/response logs
- Enable "Persist Variables" in environment settings
- Use Runner to execute collections sequentially
- Monitor network tab for additional request details

---

## 📱 Mobile Testing

### Setup for Mobile Testing

1. Use ngrok or similar tool to expose local server
2. Update environment variable: `base_url: https://your-ngrok-url.ngrok.io/api/v1`
3. Test all endpoints with mobile-like request patterns

### Mobile-Specific Headers

```
User-Agent: Mobile App/1.0
Accept: application/json
Content-Type: application/json
```

---

## 📈 Monitoring & Reporting

### Postman Monitors

1. Create monitors for critical endpoints
2. Set up alerts for failed requests
3. Schedule regular health checks

### Test Reporting

```javascript
// Add to Tests tab for comprehensive reporting
pm.test("API Response Validation", function () {
  const response = pm.response.json();

  // Basic structure validation
  pm.expect(response).to.have.property("success");
  pm.expect(response).to.have.property("message");

  // Data validation for successful responses
  if (response.success) {
    pm.expect(response).to.have.property("data");
    pm.expect(response).to.have.property("timestamp");
  }

  // Error validation for failed responses
  if (!response.success) {
    pm.expect(response).to.have.property("details");
  }
});
```

---

## 🎯 Best Practices

### Collection Organization

- Group related requests in folders
- Use consistent naming conventions
- Add descriptions to all requests
- Include prerequisites in folder descriptions

### Environment Management

- Use separate environments for dev/staging/prod
- Keep sensitive data in environment variables
- Regularly update test data IDs

### Test Script Standards

- Write descriptive test names
- Include both positive and negative test cases
- Validate response structure consistently
- Extract and set variables automatically

### Documentation

- Keep request descriptions up to date
- Document test scenarios and expected results
- Include troubleshooting tips
- Update collection when API changes

---

## 📞 Support

For API-related issues:

1. Check the main API documentation
2. Review server logs for error details
3. Test with known working credentials
4. Verify database connectivity

For Postman-specific issues:

1. Clear browser cache and cookies
2. Update Postman to latest version
3. Reset environment variables
4. Re-import collection if needed

---

## 🔄 Version History

- **v1.0** - Initial Postman testing guide
- Complete coverage of all API endpoints
- Automated test scripts included
- Error handling and troubleshooting guides
- Performance testing recommendations

---

_Happy Testing! 🚀_
