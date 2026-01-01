//9.4
/**
 * Global error middleware - centralizes all error handling.
 * 
 * How it works:
 * Express calls this middleware when any error is thrown (via next(err)).
 * Errors are handled in order: validation → domain → unexpected.
 * 
 * Error Types:
 * 1. ZodError: Request validation failed (400) - returns field-level errors
 * 2. DomainError: Business rule violation - returns error code + message
 * 3. Unexpected: Programming/database errors (500) - logs full error, returns generic message
 * 
 * Response Formats:
 * - Validation: { code: "REQUEST_VALIDATION_FAILED", errors: [{ field, code }] }
 * - Domain:     { code: DomainErrorCode, message: string }
 * - Unexpected: { message: "Internal Server Error" }
 * 
 * Note: Framework-dependent (Express) and library-dependent (Zod) - acceptable for middleware layer.
 */
import { Request, Response, NextFunction } from "express";
import { ZodError } from 'zod';
import { mapZodErrorToDtoErrorCode } from './requestValidationErrorMapper';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../domainErrors/domainErrors";

/**
 * Express error middleware - must be registered last in middleware chain.
 * All errors thrown by controllers, validation, or service layer are caught here.
 */
export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Validation errors: field-level details for client
  if (err instanceof ZodError) {
    return res.status(400).json({
      code: 'REQUEST_VALIDATION_FAILED',
      errors: mapZodErrorToDtoErrorCode(err),
    });
  }

  // Domain errors: business rule violations with error codes (part of API contract)
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      code: err.code,
      message: err.message,
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      code: err.code,
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      code: err.code,
      message: err.message,
    });
  }

  // Unexpected errors: log full error, return generic message (security: don't leak internals)
  console.error(err);
  return res.status(500).json({ message: "Internal Server Error" });
}
