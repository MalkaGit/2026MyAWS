/**
 * Phase 10.4
 * File module exporting domain error codes
 * 
 * Goal:
 *    Define business-level error codes that are part of the API contract
 *    Error codes enable frontend to show appropriate error messages to users
 *    Codes are machine-readable and independent of HTTP status codes
 * 
 * Architecture:
 *    - Machine-readable: string enum values for programmatic error handling
 *    - Independent of HTTP: same error code can map to different HTTP status codes if needed
 *    - Part of API contract: frontend depends on these codes for error handling
 *    - Domain-focused: codes represent business-level errors, not technical errors
 * 
 * Flow:
 *    1. Domain layer throws errors with specific DomainErrorCode
 *    2. Error handler middleware maps error code to HTTP response
 *    3. Frontend receives error code in API response
 *    4. Frontend uses error code to display appropriate error message to user
 * 
 * Usage:
 *    - Use in domain errors: throw new BadRequestError(DomainErrorCode.BAD_READ_REQUEST__INVALID_SORT_VALUE, "Invalid sort value")
 *    - Use in domain errors: throw new NotFoundError(DomainErrorCode.SONG_NOT_FOUND, "Song not found")
 *    - Frontend checks error.code to determine which error message to show
 * 
 * Error Code Categories:
 *    - BadRequestError codes (400): Invalid request parameters
 *    - UnauthorizedError codes (401): Authentication issues
 *    - ForbiddenError codes (403): Authorization issues
 *    - NotFoundError codes (404): Entity not found
 *    - ConflictError codes (409): Resource conflicts
 */
export enum DomainErrorCode {

    // BadRequestError codes (400)
    BAD_READ_REQUEST__INVALID_SORT_VALUE  = "BAD_READ_REQUEST__INVALID_SORT_VALUE",
    BAD_UPDATE_REQUEST__REQUEST_IS_EMPTY   = "BAD_UPDATE_REQUEST__REQUEST_IS_EMPTY",
    

    // UnauthorizedError codes (401)
    UN_AUTHORIZED = "UN_AUTHORIZED",
  
    // ForbiddenError - codes (403) - if needed in future
    FORBIDDEN = "FORBIDDEN",
    
  
    // NotFoundError codes (404)
    ENTITY_NOT_FOUND = "ENTITY_NOT_EXIST",
    SONG_NOT_FOUND   = "SONG_NOT_EXIST",

    // ConflictError codes (409) - if needed in future
    // DUPLICATE_SONG = "DUPLICATE_SONG",
  }
  