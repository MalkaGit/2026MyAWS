//8.5
/**
 * Goal
 *  Request parsing & validation middleware
 *  using Zod schemas.
 * 
 * Flow:
 * - Validates and parses request inputs (req.body, req.query, req.params)
 *            can map comma seperated string to array
* - Attaches parsed typed values back to req
 * - Relies on Zod for runtime safety
 * - Throws ZodError on failure → handled by errorMiddleware (returns 400)
 * 
 * Clean:
 * 1. Each request part (body, query, params) is validated and parsed.
 * 2. After parsing, req.body/query/params contains typed values according to your schema.
 * 3. Any ZodError is automatically caught and passed to next(err), letting your errorMiddleware handle it (returns 400 Bad Request).
 * 4. reusable middleare: You can use createRequestValidator({ body, query, params }) for any route.
 * 5. Controller simplicity: Controllers can assume that the request has valid types and structure, no need for req.validated or casting everywhere.
 * Usage: Router applies with schemas: createRequestValidator({ body, query, params })
 */

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * Request validation middleware using Zod schemas.
 * 

 */
export function createRequestValidator(schemas: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        //store parsed data in  req.body (of type any) 
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        //store parsed data in req.params (of type ParamsDictionary)
        req.params = schemas.params.parse(req.params) as Request['params'];
      }

      if (schemas.query) {
        // Parse and validate query parameters
        const parsedQuery = schemas.query.parse(req.query) as Record<string, any>;
        //Express does not allow oveeriing req.query,
        // so we store the parsed data in a custom property
        (req as any).validatedQuery = parsedQuery;
      }

    
      next();
    } catch (err) {
      next(err);
    }
  };
}
