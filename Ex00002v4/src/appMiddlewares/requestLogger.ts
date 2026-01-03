//13.1
// Goal:
//      Log line per HTTP request (whose status code < 500)
//      =>  if status code >=500, the error handler middleware sohuld log
//      =>  if it takes more than 500 ms, warn. otherwise, info
// Flow:
//      request context middleware writes correlation id to the request context as we log it here
//      auth middleware write user id to request context and we log it here
//      request logger middleware reads the request context and writes to log
// Clean:
//      tied to fw , not fw agnostic (express, NextJ,React)
//      not tied to logging library (pino, winston) isnce it users the logger wrapper api
//
// Best practices 
//      What to log ?
//      - method
//      - url
//      - status code
//      - duration (ms)
//      - correlationId (from request context)
//      - userId (from request context, if exists)
//      what not to log ?
//      - headers (may contain secrets)
//      - query params unless needed
//      - request body by default
//  
// Why middleware:
// - Runs automatically for every request
// - No need to log manually in controllers

// Load environment variables if not already loaded (defensive: ensures .env is available)
// Note: dotenv.config() is idempotent - safe to call multiple times
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { requestContext } from '../utils/request-context';

// Threshold in milliseconds
const SLOW_REQUEST_THRESHOLD_MS =
  Number(process.env.SLOW_REQUEST_THRESHOLD_MS) || 500;

// Express-compatible middleware signature
export function requestLoggerMiddleware (req: Request, res: Response, next: NextFunction) {
  // Record start time as early as possible
  const startTime = Date.now();

  /**
   * listen to the `finish` event
   * that is fired when the response was fully sent.
   */
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.route?.path || req.path || req.url,  //avoid printing query string
      statusCode: res.statusCode,
      durationMs,
      // These come from request context (AsyncLocalStorage)
      correlationId: requestContext.get('correlationId'),
      userId: requestContext.get('userId'),
    };

    // Skip logging for error responses (status >= 500)
    if (res.statusCode >= 500) return;

    //log warning, if pocessing too long. Otherwise, info
    if (durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
        logger.warn('Slow HTTP request', logData);
    } else {
        logger.info('HTTP request completed', logData);
    }
  });

  // Continue request pipeline
  next();
}
