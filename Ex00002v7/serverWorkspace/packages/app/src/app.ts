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

Typical request lifecycle:
→ request-context middleware (context + correlationId)
→ auth middleware (user info)
→ controller
→ service
→ response sent
→ request logging middleware logs summary
→ error handler logs errors if needed

*/


import express from "express";
//import cors from "cors";
//import morgan from "morgan";
//import {requestContextMiddleware} from "./appMiddlewares/requestContext";
//import {authMiddleware} from "./appMiddlewares/authMiddleware";
//import {requestLoggerMiddleware} from "./appMiddlewares/requestLogger";
import { errorMiddleware } from "@server/lib-common";
import songRouter from "./domain/songs/songs.router";

const app = express();

// Global Middlewares


// creating request context (and correlation id) - MUST be one of the FIRST middlewares
//app.use (requestContextMiddleware);

// Parse JSON request bodies
app.use(express.json());  

// Auth middleware
//app.use(authMiddleware({ required: true }));

//app.use(requestLoggerMiddleware);

// API Routes
app.use("/api/songs", songRouter);

// app.use(cors());        // Enable CORS (configure origins in production)
 // HTTP request logging (replace with Pino later)


// Error Middleware (MUST be last - catches all errors from routes above)
app.use(errorMiddleware);



// Health check endpoint (used by load balancers, Kubernetes, ECS, monitoring tools)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
