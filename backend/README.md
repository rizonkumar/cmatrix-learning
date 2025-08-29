# C-Matrix Learning Backend API

A comprehensive e-learning platform backend API built with Node.js, Express, and MongoDB. Features secure authentication, course management, user profiles, todos, kanban boards, and learning streaks.

## 🚀 Features

- **Secure Authentication & Authorization**

  - JWT-based authentication with refresh tokens
  - Role-based access control (Student, Teacher, Admin)
  - Password reset functionality
  - Secure cookie-based sessions

- **User Management**

  - Profile management with streaks tracking
  - Role-based permissions
  - Learning progress tracking

- **Course Management**

  - Structured courses with modules and lessons
  - Multiple content types (video, PDF, text, quiz)
  - Student enrollment and progress tracking
  - Teacher content creation

- **Productivity Tools**

  - Personal TODO lists with priorities
  - Kanban boards for project management
  - Learning streaks to encourage consistency

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting to prevent abuse
  - Input validation and sanitization
  - CORS protection
  - XSS protection

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Email**: Nodemailer
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cmatrix-learning/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/cmatrix_db
   CORS_ORIGIN=http://localhost:5173

   # JWT Secrets (generate strong random strings)
   ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
   REFRESH_TOKEN_EXPIRY=10d

   # Email Configuration (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Environment
   NODE_ENV=development
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
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
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "student",
      "avatar": "...",
      "currentStreak": 0,
      "longestStreak": 0
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Login User

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Logout User

```http
POST /api/v1/auth/logout
```

**Requires:** Authentication

#### Refresh Token

```http
POST /api/v1/auth/refresh-token
```

#### Forgot Password

```http
POST /api/v1/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

#### Reset Password

```http
POST /api/v1/auth/reset-password
```

**Request Body:**

```json
{
  "token": "reset-token-here",
  "newPassword": "NewPassword123!"
}
```

#### Change Password

```http
POST /api/v1/auth/change-password
```

**Request Body:**

```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### User Management Endpoints

#### Get User Profile

```http
GET /api/v1/users/profile
```

**Requires:** Authentication

#### Update User Profile

```http
PUT /api/v1/users/profile
```

**Request Body:**

```json
{
  "fullName": "Updated Name",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get User Statistics

```http
GET /api/v1/users/stats
```

#### Update Learning Streak

```http
POST /api/v1/users/streak
```

#### Delete Account

```http
DELETE /api/v1/users/delete-account
```

#### Get All Users (Admin Only)

```http
GET /api/v1/users/all?page=1&limit=10&role=student&search=john
```

#### Update User Role (Admin Only)

```http
PUT /api/v1/users/:userId/role
```

**Request Body:**

```json
{
  "role": "teacher"
}
```

## 🔐 Authentication & Security

### JWT Tokens

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (10 days), used to get new access tokens
- Tokens are stored in HTTP-only cookies for security

### Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Input Validation**: Comprehensive validation using express-validator
- **XSS Protection**: Input sanitization
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Protection**: MongoDB/Mongoose built-in protection

### Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 🗄️ Database Schema

### User Model

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  avatar: String,
  password: String (hashed),
  role: Enum ['student', 'teacher', 'admin'],
  currentStreak: Number,
  longestStreak: Number,
  lastActivityDate: Date,
  refreshToken: String,
  timestamps: true
}
```

### Course Model

```javascript
{
  title: String,
  description: String,
  instructor: ObjectId (User),
  category: String,
  thumbnail: String,
  price: Number,
  modules: [{
    title: String,
    description: String,
    order: Number,
    lessons: [{
      title: String,
      description: String,
      content: String,
      contentType: Enum ['video', 'pdf', 'text', 'quiz'],
      duration: Number,
      order: Number
    }]
  }],
  totalDuration: Number,
  totalLessons: Number,
  difficulty: Enum ['beginner', 'intermediate', 'advanced'],
  isPublished: Boolean,
  enrolledStudents: [ObjectId],
  rating: Number,
  reviewCount: Number
}
```

### Todo Model

```javascript
{
  taskDescription: String,
  isCompleted: Boolean,
  owner: ObjectId (User),
  priority: Enum ['low', 'medium', 'high'],
  dueDate: Date,
  timestamps: true
}
```

### Kanban Models

```javascript
// Board
{
  boardName: String,
  owner: ObjectId (User),
  description: String,
  isActive: Boolean,
  color: String
}

// Column
{
  title: String,
  boardId: ObjectId (Board),
  order: Number,
  color: String,
  wipLimit: Number
}

// Card
{
  title: String,
  description: String,
  columnId: ObjectId (Column),
  boardId: ObjectId (Board),
  order: Number,
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  dueDate: Date,
  assignedTo: ObjectId (User),
  labels: [String],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  comments: [{
    user: ObjectId (User),
    content: String,
    createdAt: Date
  }]
}
```

## 🧪 Testing

### Manual Testing with cURL

#### Register a new user:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "password": "Password123!",
    "role": "student"
  }'
```

#### Login:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

#### Get user profile (use access token from login):

```bash
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Cookie: accessToken=YOUR_ACCESS_TOKEN_HERE"
```

### Course Management Endpoints

#### Get All Courses

```http
GET /api/v1/courses?page=1&limit=12&category=CBSE%20Class%2010&search=physics
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category
- `subject`: Search in title
- `search`: General search
- `priceMin`, `priceMax`: Price range filter
- `isPublished`: Publication status (default: true)

#### Get Course by ID

```http
GET /api/v1/courses/:courseId
```

#### Search Courses

```http
GET /api/v1/courses/search?q=physics&page=1&limit=10
```

#### Get Courses by Category

```http
GET /api/v1/courses/category/:category?page=1&limit=10
```

#### Get Featured Courses

```http
GET /api/v1/courses/featured?limit=6
```

#### Get Course Categories

```http
GET /api/v1/courses/categories
```

### Test Accounts (from seed data)

- **Admin**: `admin@cmatrix.com` / `Admin123!`
- **Teacher**: `emily.johnson@example.com` / `Password123!`
- **Student**: `john.doe@example.com` / `Password123!`

## 👑 Admin Features

### Course Management

Admins have exclusive access to manage syllabus content through the `/api/v1/admin/courses` endpoints:

#### Create Course

```bash
curl -X POST http://localhost:8000/api/v1/admin/courses \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Physics Class 10",
    "description": "Complete Physics syllabus for CBSE Class 10",
    "category": "CBSE Class 10",
    "modules": [
      {
        "title": "Electricity",
        "lessons": [
          {"title": "Electric Current", "contentType": "video"},
          {"title": "Electric Potential", "contentType": "video"}
        ]
      }
    ],
    "teacher": "teacher_id_here",
    "price": 499,
    "isPublished": true,
    "difficulty": "intermediate"
  }'
```

#### Update Course

```bash
curl -X PUT http://localhost:8000/api/v1/admin/courses/:courseId \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN" \
  -d '{"isPublished": true}'
```

#### Delete Course

```bash
curl -X DELETE http://localhost:8000/api/v1/admin/courses/:courseId \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN"
```

#### Publish/Unpublish Course

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/courses/:courseId/publish \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN" \
  -d '{"isPublished": true}'
```

#### Bulk Operations

```bash
curl -X PATCH http://localhost:8000/api/v1/admin/courses/bulk-update \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN" \
  -d '{
    "courseIds": ["course_id_1", "course_id_2"],
    "updates": {"isPublished": false}
  }'
```

### Course Categories

Supported course categories for syllabus:

- `CBSE Class 8`, `CBSE Class 9`, `CBSE Class 10`, `CBSE Class 11`, `CBSE Class 12`
- `NEET` (Medical entrance)
- `IIT-JEE` (Engineering entrance)

### Admin Statistics

```bash
curl -X GET http://localhost:8000/api/v1/admin/stats/courses \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN"
```

### Teacher Management

```bash
curl -X GET http://localhost:8000/api/v1/admin/teachers \
  -H "Cookie: accessToken=YOUR_ADMIN_TOKEN"
```

## 📊 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"] // Only in development
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cmatrix_prod
CORS_ORIGIN=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-production-app-password
FRONTEND_URL=https://yourdomain.com
```

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure production MongoDB
- [ ] Set up email service
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable compression
- [ ] Set up reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@cmatrix-learning.com or create an issue in the repository.

## 🔄 API Versioning

The API uses versioning through URL paths:

- Current version: `v1` (`/api/v1/`)
- Future versions will be added as needed

## 📈 Monitoring & Logging

The application includes:

- Request logging with Morgan
- Error logging with stack traces (development only)
- Rate limiting monitoring
- Database connection monitoring

## 🛡️ Security Best Practices

- All passwords are hashed with bcrypt
- JWT tokens have expiration times
- Sensitive data is not logged
- Input validation on all endpoints
- Rate limiting prevents abuse
- CORS protects against unauthorized origins
- Security headers prevent common attacks
- No sensitive data in URL parameters
