//19.2

/**
 * Business-level error codes.
 * These codes are part of the API contract to let forntend show error message.
 *
 * - Machine-readable
 * - Independent of HTTP
 * - Used for programmatic error handling by API consumers
 */
export enum DomainErrorCode {

  // UnauthorizedError codes (401)
  UN_AUTHORIZED = "UN_AUTHORIZED",

  // ForbiddenError - codes (403) - if needed in future
  FORBIDDEN = "FORBIDDEN",
  

  // ConflictError codes (409) - if needed in future
  // DUPLICATE_SONG = "DUPLICATE_SONG",
  
  // BadRequestError codes (400)
  INVALID_FIELDS_VALUE            = "INVALID_FIELDS_VALUE",
  INVALID_INCLUDE_VALUE           = "INVALID_INCLUDE_VALUE",
  INVALID_SORT_VALUE              = "INVALID_SORT_VALUE",
  MISSING_INCLUDE_VALUE           = "MISSING_INCLUDE_VALUE",
  PARTIAL_UPDATE_WITHOUT_FIELDS   = "PARTIAL_UPDATE_WITHOUT_FIELDS",
  
  // NotFoundError codes (404)
  ARTIST_NOT_EXIST = "ARTIST_NOT_EXIST",
  SONG_NOT_EXIST   = "SONG_NOT_EXIST",
 
}

/**
 * Base class for all domain-specific errors.
 * All domain errors must have a code (part of API contract) and a message.
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
