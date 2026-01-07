//19.3
/**
 * Goal
 *  (behind API Gateway) Authentication middleware 
 * 
 * Flow:
 * - This auth middleware is behind API Gateway
* -  api gw handled authentication (token valid) and authorization
 *   api gw redirect request to this microservice \ monolith with x-user-id header
 * - This auth middleware 
 *   Extracts user ID from x-user-id header (set by API Gateway authorizer)
 *   Stores user ID to req.userId for convenient controller access
 *   Stores user ID in request context (for logging, service layer access)
*   if requirerd and header does not exist, throws UnauthorizedError

 * Clean:
 * 1. Framework-dependent (Express) 
 *
 * Simplicity:
 *   assuing user id is string (simple and practical)
 * 
 * * Usage:
 * - option1: requried in app level (all routes)
 * - option2: optional in app level (all routes)
 *            required in song level (only songs routes)
 *  */

import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../infra.utils/request-context';
import { UnauthorizedError } from '../domainErrors/domainErrors';

interface AuthMiddlewareOptions {
  /**
   * If true, throws UnauthorizedError when user ID is missing
   * If false, allows request to continue without user ID (optional auth)
   * @default false
   */
  required?: boolean;
}

/**
 * Authentication middleware
 * Extracts user ID from x-user-id header and stores it in request context and in the request object
 * 
 * @param options - Configuration options
 * @returns Express middleware function 
 */
export function authMiddleware(options: AuthMiddlewareOptions = {}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      //read header valuefrom request header
      const userIdHeader = 'x-user-id';
      const userId = req.headers[userIdHeader] || req.headers[userIdHeader.toLowerCase()];
      const userIdString = typeof userId === 'string' ? userId : undefined;
      
      //throw error if header does not exist
      if (!userIdString) {
        if (options.required) {
          throw new UnauthorizedError(
            'Authentication required. User ID not found in request header.'
          );
        }
        // auth header is missing and optional: continue without user ID
        return next();
      }
      
      // Store userId in request context (for logging, service layer)
      requestContext.set('userId', userIdString);
      
      // Store userId on req.userId for convenient controller access
      // userId is always string (simple and practical)
      req.userId = userIdString;
      
      next();
    } catch (err) {
      next(err);
    }
  };
}

