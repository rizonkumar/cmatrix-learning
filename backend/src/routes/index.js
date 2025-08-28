import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

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

// Placeholder routes for future features
// router.use(`${API_VERSION}/courses`, courseRoutes);
// router.use(`${API_VERSION}/todos`, todoRoutes);
// router.use(`${API_VERSION}/kanban`, kanbanRoutes);
// router.use(`${API_VERSION}/enrollments`, enrollmentRoutes);

export default router;
