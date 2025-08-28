import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./config/db.js";
import { logger } from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`🚀 C-Matrix Learning API Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        mongodb: process.env.MONGODB_URI ? "Connected" : "Not configured",
      });

      logger.info(
        `📱 Health check available at: http://localhost:${PORT}/health`
      );
      logger.info(
        `📚 API documentation available at: http://localhost:${PORT}/api/v1`
      );
    });

    // Handle server shutdown gracefully
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
      });
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed !!!", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
