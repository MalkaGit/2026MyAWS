/**
 * FOLDER PUBLIC API
 * =================
 * This is the package entry point.
 * it defines modules that can be imported by package name. 
        so if we change the file name or the folder name,
        the import statement will still work.
*/

//line below allows: import { Logger1 } from "@server/lib-common";
export { Logger1 } from "./logger1";
export {pool} from "./infra/db/mySqlDB.mysql2/db";
export {QueryInput} from "./domain/queryInput/queryInput.model";
export {QueryInputSchema} from "./domain/queryInput/queryInput.schema";
export {QueryInputValidator, FieldDependencyMap} from "./domain/queryInput/queyInput.validator";
export {QueryByIdInputSchema} from "./domain/queryByIdInput/queryByIdInput.schema";
export {BadRequestError, NotFoundError} from "./domain/errors/error.types";
export {DomainErrorCode} from "./domain/errors/error.codes";
export type {AuthenticatedTypedRequest} from "./app/express.types/express";
export {createRequestValidator} from "./app/express.middlewares/requestValidator";
export {errorMiddleware} from "./app/express.middlewares/errorHandler";
export {requestContextMiddleware} from "./app/express.middlewares/requestContext";
export {logger} from "./utils/logger/logger";
export {requestLoggerMiddleware} from "./app/express.middlewares/requestLogger";
export {authMiddleware} from "./app/express.middlewares/authMiddleware";