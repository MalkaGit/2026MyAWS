//9.4, 14.1
/**
 * Goal
 *  Global error middleware 
 *  centralizes all error handling.
 * 
 *  details
 *  - log error details
 *      different log level by error type 
 *          Validation errors   → warn
 *          Domain errors       → warn
 *          Unexpected errors   → error
 *      Always include correlation id and user id from request context

 *  - build relevant http resposse by error type
 *     1. ZodError:    400 with with field level error
 *     2. DomainError: Business rule violation - returns error code + message
 *     3. Unexpected: Programming/database errors (500) - logs full error, returns generic message
 * 
 *    Response Formats:
 *    - Validation: { code: "REQUEST_VALIDATION_FAILED", errors: [{ field, code }] }
 *    - Domain:     { code: DomainErrorCode, message: string }
*      Unexpected: { message: "Internal Server Error" }
 *
 * Flow
 *    Express calls this middleware when any error is thrown (via next(err)).
 *    Errors are handled in order: validation → domain → unexpected.
 * 
 * Clean    
 *  Framework-dependent (Express) 
 *  library-dependent (Zod) - acceptable for middleware layer.
 *  Logging + context are framework-agnostic
 */




import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { requestContext } from "../utils/request-context";
import { mapZodErrorToDtoErrorCode } from "./requestValidationErrorMapper";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../domainErrors/domainErrors";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const baseLogContext = {
    correlationId: requestContext.get("correlationId"),
    userId: requestContext.get("userId"),
    method: req.method,
    path: req.path,
  };

  // 1. Request validation errors (client mistake)
  if (err instanceof ZodError) {
    logger.warn("Request validation failed", {
      ...baseLogContext,
      errors: mapZodErrorToDtoErrorCode(err)
    });

    return res.status(400).json({
      code: "REQUEST_VALIDATION_FAILED",
      errors: mapZodErrorToDtoErrorCode(err),
    });
  }

  // 2. Domain errors (business rules)
  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof ForbiddenError ||
    err instanceof ConflictError
  ) {
    logger.warn("Domain error", {
      ...baseLogContext,
      code: err.code,
      message: err.message,
    });

    const statusCode =
      err instanceof BadRequestError ? 400 :
      err instanceof NotFoundError   ? 404 :
      err instanceof ForbiddenError  ? 403 :
      err instanceof ConflictError   ? 409 :
      500;

    return res.status(statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  // 3. Unexpected errors (bugs / infra / programming mistakes)
  logger.error("Unexpected error", {
    ...baseLogContext,
    error: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
