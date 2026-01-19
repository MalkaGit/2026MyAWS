//1 
// request-context.js
// File module exporting functions
// ------------------
// Goal: 
//  key-value store pre http request 
//  using Node's AsyncLocalStorage
// any function can read\write from\to the context
// Flow:
// Usage examples:
// 1. middleware code create requst-contect
//   and write correlation id to request-context.
//   Logger can read correlation id from the request contect 
//   and write it in any log
//   (you dont have to send the corellation id to logger)
// 2. auth middleare write user id and role  to the context 
//    and controller can read it and pass to service
// Clean:
// Framework-agnostic:      works in Express, Fastify, Next.js, or plain Node.
// Library-agnostic:        does not depend on any logger, DB, or framework.


import { AsyncLocalStorage } from 'node:async_hooks';    //Node.js built-in 

// global object
const als = new AsyncLocalStorage();


/* Creates request context and runs the next function
 * Note: All code inside nextFunction() can access the context via get()/set().
 */
export function withRequestContext(initialData: Record<string, any>, nextFunction: () => void) {
  als.run(initialData, nextFunction);
}


export const requestContext = {
    get: (key: string) => {
      const store = als.getStore() as Record<string, any> | undefined;
      return store ? store[key] : undefined;
    },
    set: (key: string, value: any) => {
      const store = als.getStore() as Record<string, any> | undefined;
      if (store) store[key] = value;
    }
  };
