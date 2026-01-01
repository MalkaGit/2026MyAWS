//8.6
// This file EXTENDS Express's Request type globally
// adding it Request.validated.query, Request.validated.body, Request.validated.params  
// usage: when request validation middleware is used,
//        it will populate the request.validated.query
//        with the query object retured from zod after parsing the query string 

import "express"; // Required so TS knows we are augmenting Express types

declare global {
  namespace Express {
    interface Request {
      /**
       * Holds validated and PARSED request data.
       *
       * - Populated by validation middleware
       * - Contains ONLY data that passed Zod validation
       * - Raw req.body / req.query / req.params remain untouched
       *
       * Why optional?
       * - Not all routes use validation middleware
       * - Prevents TypeScript from forcing checks everywhere
       */
      validated?: {
        /**
         * Parsed query string (e.g. limit as number, fields as string[])
         */
        query?: unknown;

        /**
         * Parsed request body (JSON payload)
         */
        body?: unknown;

        /**
         * Parsed route parameters (e.g. :id)
         */
        params?: unknown;
      };
    }
  }
}

// This export makes the file a module, which is REQUIRED
// for TypeScript to treat the declarations correctly
export {};
