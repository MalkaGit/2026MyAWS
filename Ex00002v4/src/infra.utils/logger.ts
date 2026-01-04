//12.4
// Goal: Central application logger.
// Requiremetns:
//       wrapping pino logger
//       expose logger abstraction (switch logger library without affecting consumers)
//       Enriches logs with data from request context 
//            eg, add to each log corrlation id that the request context middleware wrote to request contet (new id o from request header)
//            eg, add to each log the user id that the auth middleware wrote to the request context      
//  read log level from env.LOG_LEVEL (default: info)

// Clean
//   Framework-agnostic (no Express / Fastify / Next.js)
//   Library-agnostic (pino hidden behind this wrapper)
//   decoupling consumers from the logging library (pino)
//        wrapping logger
// Usage (ANYWHERE in app or domain):
//   import { logger } from '../utils/logger';
//   logger.info('Something happened');

// Load environment variables if not already loaded (defensive: ensures .env is available)
// Note: dotenv.config() is idempotent - safe to call multiple times
import dotenv from 'dotenv';
dotenv.config();

import pino from 'pino';
import { requestContext } from './request-context';

// Development: pretty logs with colors and human-readable timestamps
// Production: JSON format (better for log aggregation tools)
const isDevelopment = process.env.NODE_ENV !== 'production';

const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment && {
    //if development, use pretty logs. othewise, pino json logs
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss.l',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    },
  }),
  timestamp: pino.stdTimeFunctions.isoTime, // ISO 8601 format for production
});


/**
 * Reads data from request context
 * If there is no active request (startup / background job), values will be undefined — which is OK.
 */
function buildContextFields() {
  return {
    userId: requestContext.get('userId'),                     // populated by auth middleware
    correlationId: requestContext.get('correlationId'),      //  populated by requestContext middleware
  };
}


//Logger wrapper
const logger = {

  debug(message: string, fields: Record<string, any> = {}) {
    baseLogger.debug(
      { ...buildContextFields(), ...fields },
      message
    );
  },

  info(message: string, fields: Record<string, any> = {}) {
    baseLogger.info(
      { ...buildContextFields(), ...fields },
      message
    );
  },

  warn(message: string, fields: Record<string, any> = {}) {
    baseLogger.warn(
      { ...buildContextFields(), ...fields },
      message
    );
  },

  error(message: string, fields: Record<string, any> = {}) {
    baseLogger.error(
      { ...buildContextFields(), ...fields },
      message
    );
  },

  fatal(message: string, fields: Record<string, any> = {}) {
    baseLogger.fatal(
      { ...buildContextFields(), ...fields },
      message
    );
  },
};

export { logger };
