//9.0
//Problem1 - valiatedQuery
//    The middleware gets the typed object from the zod validator 
//    The middleare wants to writed the typed object on the reuest 
//    In express, request.body and request.params have setter 
//    However, in express request.query does not have setter 
//    Solution: 
//    -validator returned typed query object 
//    -middleare writes the typed object  on request.validated query (decoration of request added below)
//    -then, controller can read the typed quey object from the equest 
//    and pass it on to the service 
//Problem2 - TypedRequest
//    In epress, controller get Reqeuest object of type ExpressRequest 
//           in it, body, params, query are of type any
//    However, controller needs to pass typed parameters to service 
//    (the validation middleware already parsed and typed req.query, req.params, req.body)
//    solution is to to create a new interface TypedRequest 
//    that gets type parameters for body, params, query

import { Request as ExpressRequest } from 'express';

// Extend Express Request interface to include validatedQuery
// This is the industry-standard solution when you can't override req.query (it's read-only)
declare global {
  namespace Express {
    interface Request {
      // Custom property for validated query parameters
      // Express doesn't allow overriding req.query, so we use a custom property
      // Only set when a query schema is provided in validation middleware
      validatedQuery?: any;
    }
  }
}

// Generic Request type that allows specifying the body, params, and query types
// Usage: function handler(req: TypedRequest<SongCreateInput>, res: Response) { ... }
// Note: We don't override 'query' because Express's router expects it to be ParsedQs
// Instead, we use 'validatedQuery' for the typed query parameter (set by validation middleware)
export interface TypedRequest<TBody = any, TParams = any, TQuery = any> extends ExpressRequest {
  body: TBody;
  params: TParams;
  // validatedQuery is set by middleware when a query schema is provided
  // Optional because not all routes have query validation
  validatedQuery?: TQuery;
}

export {};

