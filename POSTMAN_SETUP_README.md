# 🚀 C-Matrix Learning API - Postman Setup Guide

## 📋 Quick Start

Get your C-Matrix Learning API testing environment up and running in minutes!

## 📁 Files Included

| File                                            | Description                               |
| ----------------------------------------------- | ----------------------------------------- |
| `POSTMAN_API_TESTING_GUIDE.md`                  | Comprehensive testing guide with examples |
| `C-Matrix-Learning-API.postman_collection.json` | Ready-to-import Postman collection        |
| `C-Matrix-Learning.postman_environment.json`    | Pre-configured environment variables      |

## ⚡ Fast Setup (3 Steps)

### Step 1: Import Files into Postman

1. **Open Postman**
2. **Import Collection:**

   - Click "Import" button
   - Select "File"
   - Choose `C-Matrix-Learning-API.postman_collection.json`
   - Click "Import"

3. **Import Environment:**
   - Click "Import" button again
   - Select "File"
   - Choose `C-Matrix-Learning.postman_environment.json`
   - Click "Import"

### Step 2: Start Your Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
```

**Server should be running at:** `http://localhost:8000`

### Step 3: Seed the Database (Optional but Recommended)

```bash
# Seed the database with sample data
npm run seed
```

## 🧪 Start Testing!

### 1. Select Environment

- Click the environment dropdown (top-right)
- Select "C-Matrix Learning"

### 2. Run Health Check

- Open the collection
- Find "🔐 Authentication" → "Health Check"
- Click "Send"
- ✅ Should return success message

### 3. Test Authentication Flow

- Try "Login (Admin)" request
- ✅ Should receive access token
- ✅ Environment variables will auto-populate

### 4. Test Full Workflow

Run requests in this order:

1. **Authentication** → Login as any user
2. **User Management** → Get Profile
3. **Course Management** → Get All Courses
4. **Enrollment** → Enroll in Course
5. **TODO** → Create Todo
6. **Kanban** → Create Board
7. **Reviews** → Create Review

## 🔧 Environment Variables

The environment includes these pre-configured variables:

| Variable       | Description       | Auto-populated |
| -------------- | ----------------- | -------------- |
| `base_url`     | API base URL      | ❌ Manual      |
| `access_token` | JWT access token  | ✅ Auto        |
| `user_id`      | Current user ID   | ✅ Auto        |
| `course_id`    | Current course ID | ✅ Auto        |
| `todo_id`      | Current todo ID   | ✅ Auto        |
| `board_id`     | Current board ID  | ✅ Auto        |
| `review_id`    | Current review ID | ✅ Auto        |

## 🎯 Test Scenarios Included

### ✅ Authentication Tests

- User registration
- Login/logout for all roles
- Token refresh
- Password management

### ✅ User Management Tests

- Profile operations
- Statistics retrieval
- Streak updates

### ✅ Course Management Tests

- CRUD operations (Admin)
- Search and filtering
- Category browsing

### ✅ Enrollment Tests

- Course enrollment/unenrollment
- Progress tracking
- Enrollment status checks

### ✅ Productivity Tools Tests

- TODO management
- Kanban board operations
- Bulk operations

### ✅ Review System Tests

- Review creation and management
- Rating statistics
- Admin moderation

### ✅ File Upload Tests

- Avatar uploads
- Course content uploads
- Thumbnail management

## 🧪 Automated Test Scripts

Each request includes automated tests that:

- ✅ Validate response structure
- ✅ Check HTTP status codes
- ✅ Extract and store IDs automatically
- ✅ Verify authentication

## 🔄 Testing Workflows

### Complete User Journey

1. **Register** → Create new account
2. **Login** → Authenticate user
3. **Browse Courses** → View available courses
4. **Enroll** → Join a course
5. **Create Tasks** → Add study todos
6. **Plan Studies** → Create kanban board
7. **Track Progress** → Update lesson completion
8. **Leave Review** → Rate the course
9. **View Statistics** → Check learning progress

### Admin Workflow

1. **Login as Admin** → Access admin panel
2. **Create Course** → Add new course content
3. **Manage Users** → View/modify user accounts
4. **Publish Content** → Make courses available
5. **Monitor Activity** → View system statistics

## 🚨 Common Issues & Solutions

### ❌ "Could not send request"

- **Check:** Is backend server running?
- **Solution:** Run `npm run dev` in backend directory

### ❌ 401 Unauthorized

- **Check:** Are you logged in?
- **Solution:** Run login request first, check token variables

### ❌ 404 Not Found

- **Check:** Correct endpoint URL?
- **Solution:** Verify `base_url` is set to `http://localhost:8000/api/v1`

### ❌ 500 Internal Server Error

- **Check:** Database connection
- **Solution:** Ensure MongoDB is running, run `npm run seed`

## 📊 Running Tests with Postman Runner

1. Click "Runner" button in Postman
2. Select "C-Matrix Learning API" collection
3. Choose "C-Matrix Learning" environment
4. Set iterations (e.g., 1-5)
5. Click "Run"
6. View test results and response times

## 🔧 Advanced Configuration

### Custom Environment Variables

Add these to your environment for advanced testing:

```json
{
  "test_user_email": "your-test@example.com",
  "test_user_password": "YourPassword123!",
  "custom_course_id": "specific-course-id",
  "api_timeout": 5000
}
```

### Rate Limiting Tests

The API includes rate limiting (100 requests per 15 minutes). Test by:

1. Running collection multiple times
2. Monitoring `X-RateLimit-Remaining` header
3. Expect 429 status when limit exceeded

## 📈 Performance Testing

### Response Time Monitoring

- All requests include response time validation
- Target: < 1000ms for most endpoints
- File uploads: < 5000ms

### Load Testing

- Use Postman Runner with multiple iterations
- Monitor memory usage on backend
- Check database query performance

## 🔐 Security Testing

### Authentication Tests

- Test expired tokens
- Invalid token formats
- Missing authorization headers

### Authorization Tests

- Student accessing admin endpoints (should fail)
- Teacher accessing other teacher's courses
- Unauthenticated file uploads

## 📱 Mobile API Testing

### Setup for Mobile

1. Use ngrok to expose local server:
   ```bash
   npx ngrok http 8000
   ```
2. Update `base_url` in environment:
   ```
   https://your-ngrok-url.ngrok.io/api/v1
   ```
3. Test all endpoints with mobile headers

### Mobile-Specific Headers

```json
{
  "User-Agent": "C-Matrix Mobile App/1.0",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

## 📋 Testing Checklist

### Before Starting Tests

- ✅ Backend server is running
- ✅ Database is seeded
- ✅ Environment is selected
- ✅ Base URL is correct

### Authentication Tests

- ✅ Health check passes
- ✅ Admin login works
- ✅ Teacher login works
- ✅ Student login works
- ✅ Token refresh works

### Core Functionality Tests

- ✅ Get user profile
- ✅ Browse courses
- ✅ Enroll in course
- ✅ Create todo items
- ✅ Create kanban board
- ✅ Submit course review

### Admin Tests (Admin Login Required)

- ✅ Create new course
- ✅ Update course details
- ✅ Manage user roles
- ✅ View system statistics

### File Upload Tests

- ✅ Upload user avatar
- ✅ Upload course thumbnail
- ✅ Upload course content

## 🎯 Next Steps

1. **Run the full test suite** using Postman Runner
2. **Customize requests** for your specific use cases
3. **Add new test cases** for additional scenarios
4. **Monitor performance** with the included metrics
5. **Integrate with CI/CD** for automated testing

## 📞 Support

### Common Resources

- 📖 **Detailed Guide:** `POSTMAN_API_TESTING_GUIDE.md`
- 🔧 **API Documentation:** `BACKEND_API_DOCUMENTATION.md`
- 💻 **Source Code:** `/backend` directory

### Getting Help

1. Check server logs in `/backend/logs/`
2. Verify database connection
3. Review Postman Console for detailed errors
4. Test individual endpoints incrementally

---

## 🚀 You're All Set!

Your C-Matrix Learning API testing environment is ready. Start with the Health Check and work your way through the authentication flow. Happy testing! 🎉

**Need help?** Refer to the comprehensive guide in `POSTMAN_API_TESTING_GUIDE.md`
