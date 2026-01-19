//4
/**
 * These types are used to create domain errors.
 *
 * - domain errors have 
 *   an error code that is independent of http
 *   and is readable by machines.
 * - domain errors also have a message.
 * - domain errors are thrown by domain
 *   and handled by error handler middleware (API layer)
 *   that returns http respose 
 *   with http status code and the domain error code.
 */

import { DomainErrorCode } from "./error.codes";

  /**
   * Base class for all domain-specific errors.
   */
  export abstract class DomainError extends Error {
    readonly code: DomainErrorCode;
    readonly details?: unknown;
  
    protected constructor(
      code: DomainErrorCode,
      message: string,
      details?: unknown
    ) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.details = details;
      // Ensure stack traces show where error was thrown, not constructed
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  

  /**
   * Thrown when the request is invalid according to business rules (400)
   * 
   * @example
   * throw new BadRequestError(DomainErrorCode.ARTIST_NOT_EXIST, "Artist does not exist");
   */
    export class BadRequestError extends DomainError {
      constructor(code: DomainErrorCode, message: string, details?: unknown) {
        super(code, message, details);
      }
    }
  
  /**
   * Thrown when authentication is required but missing (401)
   * 
   * @example
   * throw new UnauthorizedError  ();
   */
  export class UnauthorizedError extends DomainError {
    constructor(message: string, details?: unknown) {
      super(DomainErrorCode.UN_AUTHORIZED, message, details);
    }
  }
  
  /**
   * Thrown when an operation is forbidden by business rules (403)
   * 
   * @example
   * throw new ForbiddenError("User does not have permission");
   */
  export class ForbiddenError extends DomainError {
    constructor( message: string, details?: unknown) {
      super(DomainErrorCode.FORBIDDEN, message, details);
    }
  }
  
  /**
   * Thrown when a requested entity is not found (404)
   * 
   * @example
   * throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND, "Song with id 123 not found");
   */
  export class NotFoundError extends DomainError {
    constructor(code: DomainErrorCode, message: string, details?: unknown) {
      super(code, message, details);
    }
  }
  

  
  /**
   * Thrown when a conflict occurs (e.g., duplicate entry) (409)
   * 
   * @example
   * throw new ConflictError(DomainErrorCode.DUPLICATE_SONG, "Song title already exists");
   */
  export class ConflictError extends DomainError {
    constructor(code: DomainErrorCode, message: string, details?: unknown) {
      super(code, message, details);
    }
  }
  