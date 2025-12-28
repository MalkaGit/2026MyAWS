//8.4
// src/app.ts
// Goal: 
//    initalize express app (routes, middlewares etc)
//    add health endpoint (used by Load balancers,Kubernetes,ECS, Monitoring tools)
//Clean: 
//    not fw agnostic (tied to express)
//Industry standard :  
//    do NOT call listen() in app.ts
import express from "express";
//import cors from "cors";
//import morgan from "morgan";
import { errorMiddleware } from "./appMiddlewares/errorMiddleware";
import songRouter from "./appRoutes/songRouter";


const app = express();

/**
 * ──────────────────────────────
 * Global Middlewares
 * ──────────────────────────────
 */
// Parse JSON request bodies
app.use(express.json());

// Enable CORS (configure origins in production)
//app.use(cors());

// HTTP request logging (replace with Pino later)
//app.use(morgan("dev"));



/**
 * ──────────────────────────────
 * Health check (important for load balancers / k8s) 
 * ──────────────────────────────
 */
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  
/**
 * ──────────────────────────────
 * Routes
 * ──────────────────────────────
 */
// API routes
app.use("/api/songs", songRouter);

/**
 * ──────────────────────────────
 * Error Handling (MUST be last)
 * ──────────────────────────────
 */
app.use(errorMiddleware);

export default app;
