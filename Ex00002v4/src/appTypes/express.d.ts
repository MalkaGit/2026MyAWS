//19.1
// ============================================================================
// PURPOSE: Add custom properties to Express Request for type safety
// ============================================================================
// 1. validatedQuery: Typed query parameters (Express's req.query is read-only)
// 2. userId: User ID from authentication middleware
// 3. AuthenticatedTypedRequest: Generic type for strongly-typed request handlers

import { Request as ExpressRequest } from 'express';

// ============================================================================
// MODULE AUGMENTATION: Add custom properties to Express Request
// ============================================================================
// TypeScript allows extending third-party types using "declare global"
// This adds validatedQuery and userId to ALL Express Request objects
// ============================================================================
declare global {
  namespace Express {
    interface Request {
      // Typed query parameters (set by validation middleware)
      // Optional because not all routes validate query strings
      // Type is 'any' here (can't use generics in global declarations)
      validatedQuery?: any;
      
      // User ID from authentication middleware
      // Optional because not all routes require authentication
      userId?: string;
    }
  }
}

// ============================================================================
// AuthenticatedTypedRequest: Strongly-typed request for authenticated routes
// ============================================================================
// Provides type safety for body, params, and query parameters
// 
// Usage:
//   AuthenticatedTypedRequest<SongCreateInput, {id: string}, QueryInput>
//   - body: SongCreateInput (not 'any')
//   - params: {id: string} (not 'any')
//   - validatedQuery: QueryInput (not 'any')
//   - userId: string (guaranteed by auth middleware)
// ============================================================================
export type AuthenticatedTypedRequest<TBody = any, TParams = any, TQuery = any> = 
ExpressRequest & {
  body: TBody;
  params: TParams;
  validatedQuery?: TQuery;
  
  // userId must be optional (?) for Express router compatibility
  // 
  // Why optional?
  // - Express router expects Request with userId?: string
  // - Making it required (userId: string) breaks router type checking
  // 
  // Runtime guarantee:
  // - Auth middleware with required: true guarantees userId exists (throws 401 if missing)
  // - Use req.userId! in controllers to assert it's definitely a string
  // 
  // Why not like validatedQuery?
  // - validatedQuery: Sometimes undefined (conditionally set by middleware)
  // - userId: Always set when auth middleware runs with required: true
  userId?: string;
};

// Export {} makes this file a module (required for declare global to work)
export {};
















