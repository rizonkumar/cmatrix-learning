import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import courseRoutes from "./course.routes.js";
import adminRoutes from "./admin.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import todoRoutes from "./todo.routes.js";
import kanbanRoutes from "./kanban.routes.js";
import reviewRoutes from "./review.routes.js";

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

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/courses`, courseRoutes);
router.use(`${API_VERSION}/admin`, adminRoutes);
router.use(`${API_VERSION}/enrollments`, enrollmentRoutes);
router.use(`${API_VERSION}/todos`, todoRoutes);
router.use(`${API_VERSION}/kanban`, kanbanRoutes);
router.use(`${API_VERSION}/reviews`, reviewRoutes);

export default router;
