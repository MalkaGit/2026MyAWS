/**
 * FOLDER IS NOW MODULE: FOLDER BARREL EXPORT
 * ===========================================
 * This is the folder entry point.
 * It allows imports from the folder path instead of the specific file.
 * 
 * Example: import { DomainErrorCode, BadRequestError } from "./domain/errors";
 *          instead of: import { DomainErrorCode } from "./domain/errors/error.codes";
 *                      import { BadRequestError } from "./domain/errors/error.types";
 */

export { DomainErrorCode } from "./error.codes";
export { 
  DomainError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from "./error.types";

