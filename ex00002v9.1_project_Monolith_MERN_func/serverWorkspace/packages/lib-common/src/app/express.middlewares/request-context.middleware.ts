/**
 * Phase 10.7
 * File module exporting functions
 * Goal:
 *    helps in aggregating logs of specific request throught different microservices  
 * Usage:
 *    router applies requestContextMiddleware as middleware
 * Configuration:
 * Dependencies:
 *      install packages:
 *        cd in serverWorkspace/packages/lib-common
 *        npm install express
 * Flow:
 *   -read  x-correlation-id  from request header
 *    or generate new one (using randomUUID) when missing 
 *   -create new request context 
 *   -store the correlation id in the request object
 *    (so controller can read it to pass to service layer)
 *   -store correlation id in request context
 *    so every layer (app, service,reposiotry,utils) can read it.
 *    eg, logger util can add correlation id to the log message
 *   -store correlation id to the client in response header (x-correlation-id)
 *    so client can read it to pass to the next microservice
 *    eg, auth microservice generates correlation id and passes it to data microservice
 *   -it starts processing the request with that context
 * Clean:
 *   -tied to framework (express), not framework-agnostic
 *   -Business code remains framework-agnostic
 * Notes:
 *    -correlation id helps in aggregating logs of specific request throught different microservices  
 *    -auth microservice should generate correlation id 
 *     and pass it on to the specific (data) microservice 
 *    -when micro service calls other micro service
 *     it should pass the correlation id to the other microservice
 */
import { Request, Response, NextFunction } from 'express';
import { requestContext, withRequestContext } from "../../utils/request-context";

import { randomUUID } from 'node:crypto';
const CORRELATION_ID_HEADER = 'x-correlation-id';

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. read correlation id from request headers
  //    (Convert headerValue to string | undefined)
  const headerValue: string | string[] = req.headers[CORRELATION_ID_HEADER] || req.headers[CORRELATION_ID_HEADER.toLowerCase()];
  const incomingCorrelationId: string | undefined = 
    headerValue ? (Array.isArray(headerValue) ? headerValue[0] : headerValue) : undefined;
  // 2. Generate new one if missing
  const correlationId: string = incomingCorrelationId || randomUUID();
  // 3. create request context util
  withRequestContext({}, () => {
    // 3.1 Store correlation id in request context (used by logger)
    requestContext.set('correlationId', correlationId);
    // 3.2 Store correlation id in the request object
    req.context = {
      correlationId: correlationId
    };
    // 3.3 store correlation id in response header
    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    // 3.4 Start processing the request with the request context
    next();
  });
}
