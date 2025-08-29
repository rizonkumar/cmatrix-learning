import { Router } from 'express';
import { courseController } from '../controllers/course.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { sanitizeInput } from '../middlewares/validation.middleware.js';

const router = Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.route('/')
    .get(courseController.getAllCourses);

router.route('/search')
    .get(courseController.searchCourses);

router.route('/featured')
    .get(courseController.getFeaturedCourses);

router.route('/categories')
    .get(courseController.getCategories);

router.route('/category/:category')
    .get(courseController.getCoursesByCategory);

router.route('/:courseId')
    .get(courseController.getCourseById);

// Protected routes (require authentication for detailed course access)
router.route('/:courseId/details')
    .get(verifyJWT, courseController.getCourseById);

export default router;
