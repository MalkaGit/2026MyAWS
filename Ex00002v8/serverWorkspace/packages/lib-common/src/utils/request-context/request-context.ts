//12.1 
// request-context.js
// ------------------
// Goal: 
//  key-value store pre http request 
//  using Node's AsyncLocalStorage
// any function can read\write fromm\to the context
// Flow:
// Usage examples:
// 1. middleware code can write to request-context data (eg, correlation id)
//    and logger can read and log it 
// 2. Jwt middleare can write user id to the context 
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
