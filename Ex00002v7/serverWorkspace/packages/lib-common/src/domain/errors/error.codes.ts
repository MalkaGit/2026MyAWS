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
  