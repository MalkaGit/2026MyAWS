//4
/**
 * Business-level error codes.
 * These codes are part of the API contract to let forntend show error message.
 *
 * - Machine-readable
 * - Independent of HTTP
 * - Used for programmatic error handling by API consumers
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
  