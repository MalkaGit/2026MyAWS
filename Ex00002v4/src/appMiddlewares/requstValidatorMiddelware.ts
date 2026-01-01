//8.7
/**
 * Request validation middleware using Zod schemas.
 * 
 * Critical:
 *   - Validates req.body, req.query, req.params before controller
 *   - Stores validated data in req.validated (raw data untouched)
 *   - Throws ZodError on failure → handled by errorMiddleware (returns 400)
 * 
 * Usage: Router applies with schemas: createRequestValidator({ body, query, params })
 */

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * @param schemas - Optional Zod schemas for body, query, params
 * @returns Middleware that validates and stores in req.validated
 * 
 * @example createRequestValidator({ body: schema, query: schema, params: schema })
 */
export function createRequestValidator(schemas: {
  body?: ZodTypeAny;    // Schema for req.body (request payload)
  query?: ZodTypeAny;   // Schema for req.query (query string parameters)
  params?: ZodTypeAny;  // Schema for req.params (URL path parameters)
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.validated) {
        req.validated = {};
      }

      // Parse throws ZodError on failure → caught below → passed to errorMiddleware
      if (schemas.body) {
        req.validated.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.validated.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.validated.params = schemas.params.parse(req.params);
      }

      next();
    } catch (err) {
      // ZodError → errorMiddleware returns 400 with mapped error codes
      // Other errors → errorMiddleware handles appropriately
      next(err);
    }
  };
}


