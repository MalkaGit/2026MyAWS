//6
/**
 * Base class for all domain-specific errors
 */
export class DomainError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Thrown when a requested entity is not found
   */
  export class NotFoundError extends DomainError {
    constructor(message: string = "Resource not found") {
      super(message);
    }
  }
  
  /**
   * Thrown when the request is invalid according to business rules
   */
  export class BadRequestError extends DomainError {
    constructor(message: string = "Bad request") {
      super(message);
    }
  }
  
  /**
   * Thrown when an operation is forbidden by business rules
   */
  export class ForbiddenError extends DomainError {
    constructor(message: string = "Operation forbidden") {
      super(message);
    }
  }
  
  /**
   * Thrown when a conflict occurs (e.g., duplicate entry)
   
  export class ConflictError extends DomainError {
    constructor(message: string = "Conflict") {
      super(message);
    }
  }
  */