/**
 * Phase 10.5
 * File module exporting types
 * 
 * Goal:
 *    Declare TypedRequest<TBody, TParams, TQuery>
 *    TBody is the type of the body property - Optional
 *    TParams is the type of the params property - Optional 
 *    TQuery is the type of the query string parameters  - Optional
 * 
 * Usage:
 *    Controller can accees req.validatedQuery to get typed object with parsed query string parameters
 *    Controller can access req.body to get typed object 
 *    Controller can access req.params to get typed parameters 
 * 
 * Flow:
 *    1. Request-validation middleware uses Zod to parse request and write parsed dta on the request 
 *    2. Controller can then safely work on typed request
 * 
 * Dependencies:
 *    cd in serverWorkspace/packages/lib-common
 *    npm install express
 *    npm install --save-dev @types/express
 * 
 * Note: Request context (correlationId, userId, userRole) 
 *       is not stored on request object, 
 *       but in framework-agnostic requestContext utility (AsyncLocalStorage), not on req.context or req.user. 
 *       Access request context via requestContext.getCorrelationId(), requestContext.getUserId(), etc.
 */

import { Request as ExpressRequest } from 'express';

/**
 * MODULE AUGMENTATION: Extend Express Request interface
 * Adds validatedQuery property to all Express Request objects
 * Type is 'any' here because generics aren't allowed in global declarations
 * Actual typing is provided by TypedRequest<TBody, TParams, TQuery>
 */
declare global {
  namespace Express {
    interface Request {
      // Validated query string parameters (set by request-validator middleware)
      // Optional because not all routes validate query strings
      validatedQuery?: any;
    }
  }
}

/**
 * TypedRequest: Strongly-typed request for Express handlers
 * Provides type safety for body, params, and validatedQuery
 * 
 * @template TBody - Type for req.body (default: any)
 * @template TParams - Type for req.params (default: any)
 * @template TQuery - Type for req.validatedQuery (default: any)
 * 
 * @example
 *   For update song endpoint, controller can access typed body and params
 *   TypedRequest<SongUpdateInput, {id: string}, any>
 *   - body: SongUpdateInput    - the body of the request (the song to update)
 *   - params: {id: string}     - the id of the song to update
 * 
 * @example
 *   For reading songs, controller can access typed validated query string
 *   TypedRequest<any, any, QueryInput>
 *   it can then access req.validatedQuery of type ReadQueryInput
 *   to get parsed query sttring data: sotry (comma seperated string splint into string array),  offset: number, limit: number
 */
export type TypedRequest<TBody = any, TParams = any, TQuery = any> = 
ExpressRequest & {
  body: TBody;
  params: TParams;
  validatedQuery?: TQuery;
};

// Export {} makes this file a module (required for declare global to work)
export {};




