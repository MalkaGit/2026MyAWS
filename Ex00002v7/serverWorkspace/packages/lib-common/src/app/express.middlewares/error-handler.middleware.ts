//TODO: replace console log with logger
//9.4, 14.1, 19.4
/**
 * Goal
 *  Global error middleware 
 *  centralizes all error handling.
 * 
 *  details
 *  - log error details
 *      different log level by error type 
 *          request validation errors   → warn
 *          Domain errors               → warn
 *          Unexpected errors           → error
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
import { ZodError, ZodIssue } from "zod";
import { logger } from "../../utils/logger/logger";
//import { requestContext } from "../infra.utils/request-context";
import {
  DomainError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../domain/errors/error.types";

/**
 * Error Codes (with examples):
 * 
 * - invalid_type: Wrong data type provided
 *   Example: { field: "limit", code: "invalid_type" } when limit="abc" (expected number)
 * 
 * - too_small: Value below minimum (string length, number, array size)
 *   Example: { field: "title", code: "too_small" } when title="" (min length 1)
 *   Example: { field: "limit", code: "too_small" } when limit=0 (min 1)
 * 
 * - too_big: Value above maximum (string length, number, array size)
 *   Example: { field: "limit", code: "too_big" } when limit=200 (max 100)
 * 
 * - invalid_string: Invalid string format (general)
 *   Example: { field: "url", code: "invalid_string" } when url="not-a-url"
 * 
 * - uuid: Invalid UUID format
 *   Example: { field: "id", code: "uuid" } when id="not-a-uuid"
 * 
 * - url: Invalid URL format
 *   Example: { field: "url", code: "url" } when url="invalid-url"
 * 
 * - email: Invalid email format
 *   Example: { field: "email", code: "email" } when email="not-an-email"
 * 
 * - unrecognized_keys: Extra fields not allowed (strict mode)
 *   Example: { field: "root", code: "unrecognized_keys" } when body has extra fields
 * 
 * - custom: Custom validation error from schema.refine()
 *   Example: { field: "root", code: "at_least_one_field_required" } from custom refine message
 * 
 * - invalid: Unknown/unmapped error code
 *   Example: { field: "field", code: "invalid" } for unexpected validation errors
 * 
 * Field paths: dot notation for nested (e.g., "user.address"), 'root' for root-level errors
 * Returns: Array of errors (multiple validation failures possible in single request)
 */
interface FieldErrorDto {
  field: string;  // Field path (dot notation for nested, 'root' for root-level)
  code: string;   // Stable error code (library-agnostic)
}

function mapZodErrorCodeToDtoErrorCode(issue: ZodIssue): string {
  switch (issue.code) {
    case 'invalid_type':
      return 'invalid_type';

    case 'too_small':
      return 'too_small';

    case 'too_big':
      return 'too_big';

    case 'invalid_format':
      // Handle validation-specific codes (uuid, url, email, etc.)
      const validationType = 'validation' in issue ? (issue as any).validation : undefined;
      return validationType ?? 'invalid_string';

    case 'unrecognized_keys':
      return 'unrecognized_keys';

    case 'custom':
      // ⚠️ Schema authors must use stable error code strings in refine() messages
      // Good: 'at_least_one_field_required' | Bad: `Field ${fieldName} is required`
      return issue.message;

    default:
      return 'invalid';
  }
}

function mapZodErrorToDtoError(error: ZodError): FieldErrorDto[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : 'root',
    code: mapZodErrorCodeToDtoErrorCode(issue),
  }));
}

/**
 * Maps domain error instances to their HTTP status codes
 */
function getDomainErrorStatusCode(err: DomainError): number {
  if (err instanceof BadRequestError) return 400;
  if (err instanceof UnauthorizedError) return 401; //not authenticated 
  if (err instanceof ForbiddenError) return 403;    //not authorized
  if (err instanceof NotFoundError) return 404;
  if (err instanceof ConflictError) return 409;
  // Fallback (should never happen if all domain errors are properly handled)
  return 500;
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const baseLogContext = {
    //correlationId: requestContext.get("correlationId"),
    //userId: requestContext.get("userId"),
    method: req.method,
    path: req.path,
  };

  // 1. Request validation errors (client mistake)
  if (err instanceof ZodError) {
    const validationErrors = mapZodErrorToDtoError(err);
    
    logger.warn("Request validation failed", {
      ...baseLogContext,
      errors: validationErrors,
    });

    return res.status(400).json({
      code: "REQUEST_VALIDATION_FAILED",
      errors: validationErrors,
    });
  }

  // 2. Domain errors (business rules)
  if (err instanceof DomainError) {
    const statusCode = getDomainErrorStatusCode(err);
    
    logger.warn("Domain error", {
      ...baseLogContext,
      code: err.code,
      message: err.message,
    });

    return res.status(statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  // 3. Unexpected errors (bugs / infra / programming mistakes)
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;

  logger.error("Unexpected error", {
    ...baseLogContext,
    error: errorMessage,
    stack: errorStack,
  });

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
