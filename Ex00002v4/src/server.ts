//9.6, 15.1
/**
 * Express server startup
 * 
 * Goal:
 *  -Starts the HTTP server and listens for incoming requests.
 *  - Process-level crash logging
 * 
 * Configuration:
 * PORT Configuration:
 *  - Local machine: Uses PORT from .env file or environment variable, defaults to 3000
 *  - Cloud platforms (AWS ECS, Lambda, etc.): PORT is automatically set by the platform
 *    Example: AWS Lambda sets PORT=8080, ECS sets PORT based on container port mapping
 * 
 * Critical:
 *  - Separate from app.ts (separation of concerns: app config vs server startup)
 *  - Not framework-agnostic (tied to Express)
 *  - dotenv.config() MUST be called first, before any other imports that use process.env
 */

// Load environment variables from .env file FIRST, before any other imports
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "./utils/logger";

// 15.1 log process-level crashes  (not related to http requests)
// Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (error: Error) => {
  logger.fatal("Uncaught Exception - Application will exit", {
    error: error.message,
    stack: error.stack,
    name: error.name,
  });
  // Exit with failure status code
  process.exit(1);
});

// 15.1 log process-level crashes  (not related to http requests)
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  const errorStack = reason instanceof Error ? reason.stack : undefined;
  logger.fatal("Unhandled Rejection - Application will exit", {
    error: errorMessage,
    stack: errorStack,
    promise: promise.toString(),
  });
  // Exit with failure status code
  process.exit(1);
});

// PORT: from environment variable (.env file or platform/cloud) or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
