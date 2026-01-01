//9.5
/**
 * Express application setup
 * 
 * Initializes Express app with:
 *  - Global middlewares (JSON parsing, CORS, logging)
 *  - Health check endpoint (used by load balancers, Kubernetes, ECS, monitoring tools)
 *  - API routes
 *  - Error handling middleware (MUST be last)
 * 
 * Critical:
 *    Clean: not fw agnostic (tied to express 
 *  - Error middleware must be registered last to catch all errors from routes
 *  - Do NOT call listen() here - separate concern (see server.ts)
 */


import express from "express";
//import cors from "cors";
//import morgan from "morgan";
import { errorMiddleware } from "./appMiddlewares/errorMiddleware";
import songRouter from "./appRoutes/songRouter";

const app = express();

// Global Middlewares
app.use(express.json());  // Parse JSON request bodies
// app.use(cors());        // Enable CORS (configure origins in production)
// app.use(morgan("dev")); // HTTP request logging (replace with Pino later)

// Health check endpoint (used by load balancers, Kubernetes, ECS, monitoring tools)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// API Routes
app.use("/api/songs", songRouter);

// Error Handling Middleware (MUST be last - catches all errors from routes above)
app.use(errorMiddleware);

export default app;
