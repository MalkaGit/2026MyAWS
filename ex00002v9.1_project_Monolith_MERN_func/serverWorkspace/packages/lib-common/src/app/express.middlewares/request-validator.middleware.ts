/**
 * Phase 10.6
 * File module exporting functions
 * Goal:
 *    provides run time type safety for request inputs using zod
 * Usage:
 *    router calls createRequestValidator with schemas
 * Configuration:
 * Dependencies:
 *      install packages:
 *        cd in serverWorkspace/packages/lib-common
 *        npm install express
 *        npm install zod
 * Flow:
 *   -it gets request and schemas for the request
 *   -it parses request parts (body, query, params) by the given schemas
 *   -if request matches the schema, 
 *      it writes the parsed req.body   over the string values on the request
 *      it writes the parsed req.params over the string values on the request
 *      it writes the parsed req.query  into req.validatedQuery  (since req.query is immutable)
 *   -Otherwise,
 *    it throws ZodError and passes it to next(err)
 *    Zod error is handled by errorMiddleware (returns 400 Bad Request)
 */

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';


export function createRequestValidator(schemas: { //the schema for body, query, params
  body?: ZodTypeAny;      
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        //parse the request body using schemas.body
        //and store the parsed typed data in  req.body (of type any) 
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        //parse the request params using schemas.params
        //and store the parsed typed data in req.params (of type ParamsDictionary)
        req.params = schemas.params.parse(req.params) as Request['params'];
      }

      if (schemas.query) {
        //parse the request query using schemas.query
        //and store the parsed typed data in req.validatedQuery (of type any)         
        //since Express does not allow overriding req.query 
        const parsedQuery = schemas.query.parse(req.query);
        req.validatedQuery = parsedQuery;
      }

    
      next();
    } catch (err) {
      next(err);
    }
  };
}
