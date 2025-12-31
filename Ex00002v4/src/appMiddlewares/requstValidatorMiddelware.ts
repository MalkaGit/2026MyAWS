//8.7
/**
 * Creates a reusable Express middleware that validates request data using Zod schemas.
 * 
 * Purpose:
 *   - called before the controller
 *   - Validates req.body, req.query (string), and req.params (eg, song/<id>) against Zod schemas
 *   - Converts untyped request data to typed, validated data
 *   - Passes valid requests to the next middleware/controller
 *   - Returns 400 Bad Request with zod-agnotic error code if validation fails
 * 
 * Usage:
 *   Router calls this with schemas
 * 
 * Benefits:
 *   - Single validation middleware for all endpoints
 *   - Controller and service assumes that request structure is valid
 *   - Framework-agnostic: thin Express wrapper, easy to replace
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { mapZodErrorToDtoErrorCode } from './requestValidationErrorMapper';

/**
 * Creates an Express middleware that validates request parts 
 * 
 * @param schemas - Optional Zod schemas for body, query, and params validation
 * @returns Express middleware function that validates and types the request data
 * 
 * @example
 * // In router:
 * createRequestValidator({
 *   body: songCreateSchema,      // validates req.body
 *   query: songQuerySchema,       // validates req.query (stirng)
 *   params: songParamsSchema      // validates req.params (eg, song/<id>)
 * })
 */
export function createRequestValidator(schemas: {
  body?: ZodTypeAny;    // Schema for req.body (request payload)
  query?: ZodTypeAny;   // Schema for req.query (query string parameters)
  params?: ZodTypeAny;  // Schema for req.params (URL path parameters)
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate req.body if schema provided
      // parse() throws ZodError if validation fails
      if (schemas.body) {
        schemas.body.parse(req.body);
      }

      // Validate and transform req.query if schema provided
      // parse() returns typed data, replacing untyped query strings
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }

      // Validate req.params if schema provided
      // parse() throws ZodError if validation fails 
      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      // All validations passed - continue to next middleware/controller
      next();
    } catch (err) {
      // Handle validation errors
      if (err instanceof ZodError) {
        // Validation failed - return 400 Bad Request with error details
        return res.status(400).json({
          code: 'REQUEST_VALIDATION_FAILED',
          errors: mapZodErrorToDtoErrorCode(err),
        });
      }
      // Other errors (unexpected) - pass to global error middleware
      next(err);
    }
  };
}


