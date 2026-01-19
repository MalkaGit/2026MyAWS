//5
// Goals:
//    Declare TypedRequest with RequestContext (contains correlationId)
//    Declare TypedAuthorizedRequest with AuthorizedRequestContext (contains userId and userRole)
// Usage:
// -1. zod will parse the query string parameters and validate them
// -2. controller will get typed request instead express untyped request
//          with correlation id 
//          with parsed query string parameters according to given type
// -3. corrleation id managment
//     request-context middleware writes the correlationId on the request 
//     controller may read it from the requst
// -4. userId and userRole managment
//     auth middleware writes userId and userRole on the request
//     controller may read it from the requst and pass it to the service layer 
// dependencies: express
//      cd in serverWorkspace/packages/lib-common and run:
//      npm install --save-dev @types/express
// ============================================================================

import { Request as ExpressRequest } from 'express';

// ============================================================================
// RequestContext: Base request context (for unauthenticated routes)
// ============================================================================
export interface RequestContext {
  correlationId: string;
}

// ============================================================================
// AuthorizedRequestContext: Extended context for authenticated routes
// ============================================================================
export interface AuthorizedRequestContext extends RequestContext {
  userId: string;
  userRole: string;
}

// ============================================================================
// MODULE AUGMENTATION: Add custom properties to Express Request
// ============================================================================
// TypeScript allows extending third-party types using "declare global"
// This adds validatedQuery and context to ALL Express Request objects
// ============================================================================
declare global {
  namespace Express {
    interface Request {
      // Typed query parameters (set by validation middleware)
      // Optional because not all routes validate query strings
      // Type is 'any' here (can't use generics in global declarations)
      validatedQuery?: any;
      
      // Request context from middleware (request-context, auth, etc.)
      // Can be RequestContext (unauthenticated) or AuthorizedRequestContext (authenticated)
      // Optional because middleware may not always set it
      context?: RequestContext | AuthorizedRequestContext;
    }
  }
}

// ============================================================================
// TypedRequest: Strongly-typed request for unauthenticated routes
// ============================================================================
// Provides type safety for body, params, and query parameters
// Used for routes that don't require authentication (e.g., register, login)
// 
// Usage:
//   TypedRequest<SongCreateInput, {id: string}, QueryInput>
//   - body: SongCreateInput (not 'any')
//   - params: {id: string} (not 'any')
//   - validatedQuery: QueryInput (not 'any')
//   - context: RequestContext (has correlationId only)
// ============================================================================
export type TypedRequest<TBody = any, TParams = any, TQuery = any> = 
ExpressRequest & {
  body: TBody;
  params: TParams;
  validatedQuery?: TQuery;
  
  // Context is optional for Express router compatibility
  // Runtime guarantee: Request-context middleware sets correlationId
  context?: RequestContext;
};

// ============================================================================
// TypedAuthorizedRequest: Strongly-typed request for authenticated routes
// ============================================================================
// Provides type safety for body, params, and query parameters
// Used for routes that require authentication (e.g., create song, update profile)
// 
// Usage:
//   TypedAuthorizedRequest<SongCreateInput, {id: string}, QueryInput>
//   - body: SongCreateInput (not 'any')
//   - params: {id: string} (not 'any')
//   - validatedQuery: QueryInput (not 'any')
//   - context: AuthorizedRequestContext (has correlationId, userId, userRole)
// ============================================================================
export type AuthorizedTypedRequest<TBody = any, TParams = any, TQuery = any> = 
ExpressRequest & {
  body: TBody;
  params: TParams;
  validatedQuery?: TQuery;
  
  // Context is optional for Express router compatibility
  // Runtime guarantee: Auth middleware sets userId and userRole, request-context middleware sets correlationId
  // Use req.context! in controllers to assert it's definitely set
  context?: AuthorizedRequestContext;
};

// Export {} makes this file a module (required for declare global to work)
export {};




