//10.5
/**
 * Goal 
 *  valiate reuest for all endpoints   (called by router)
 * Flow
 *    called from router that pass it the requst and the controller method
 *    validate a request against a given Zod schema
 *    if request is valid, continue to controller
 *    on schema error, map schema error to http error and return bad request
 *    on other error, pass to error middleware
 * Clean
 *    single validation middleware for all endpoints (all schemas)
 *    middleware is tied to fw (express) - they are thin and easy to replace. 
*/


import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * Generic middleware to validate body/query/params
 */
export function createRequestValidator(schemas: {
  params?: ZodSchema<any>;
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
}): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //parse
      //router builds schemsa object for params, body, query. Here we call validation for each part
      if (schemas.params) schemas.params.parse(req.params ?? {});
      if (schemas.body) schemas.body.parse(req.body ?? {});
      if (schemas.query) schemas.query.parse(req.query ?? {});

      //call controller
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        //zod error, return bad request
        const errors = err.issues.map(issue => ({
          field: issue.path.join('.') || '_request',
          message: issue.message,
          code: issue.code,
        }));
        return res.status(400).json({
          code: 'REQUEST_VALIDATION_FAILED',
          errors,
        });
      }
      //other erorr, coninue to error middleware
      next(err);
    }
  };
}

