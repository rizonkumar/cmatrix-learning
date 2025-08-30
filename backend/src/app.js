import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createRateLimitOptions } from "./middlewares/validation.middleware.js";
import routes from "./routes/index.js";
import { logger } from "./utils/logger.js";

const app = express();

// Security middleware - Helmet (must be first)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Trust proxy for rate limiting and security headers
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit(
  createRateLimitOptions(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    "Too many requests from this IP, please try again later."
  )
);
app.use("/api/", limiter);

// More strict rate limiting for auth routes
const authLimiter = rateLimit(
  createRateLimitOptions(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 auth requests per windowMs
    "Too many authentication attempts, please try again later."
  )
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Logger middleware
app.use(morgan("combined"));

// Body parsing middleware with size limits
app.use(
  express.json({
    limit: "10mb",
    strict: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Cookie parser middleware
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Static files middleware with security
app.use(
  express.static("public", {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  })
);

// Mount API routes
app.use("/", routes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Request logging middleware
app.use(logger.request);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error with structured data
  logger.error("Application Error", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    user: req.user ? req.user._id : "anonymous",
    statusCode,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && {
      stack: err.stack,
      details: err.details || null,
    }),
  });
});

export { app };
