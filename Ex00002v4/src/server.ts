//9.6
/**
 * Express server startup
 * 
 * Starts the HTTP server and listens for incoming requests.
 * 
 * PORT Configuration:
 *  - Local machine: Uses PORT from .env file or environment variable, defaults to 3000
 *  - Cloud platforms (AWS ECS, Lambda, etc.): PORT is automatically set by the platform
 *    Example: AWS Lambda sets PORT=8080, ECS sets PORT based on container port mapping
 * 
 * Critical:
 *  - Separate from app.ts (separation of concerns: app config vs server startup)
 *  - Not framework-agnostic (tied to Express)
 */

import app from "./app";

// PORT: from environment variable (.env file or platform/cloud) or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
