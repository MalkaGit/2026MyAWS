//5
/**
 * FOLDER IS NOW MODULE: FOLDER BARREL EXPORT
 * ===========================================
 * This is the folder entry point.
 * It allows imports from the folder path instead of the specific file.
 * 
 * Example: import { TypedRequest, RequestContext } from "./app/express.types";
 *          instead of: import { TypedRequest, RequestContext } from "./app/express.types/express.d";
 */

export type { TypedRequest, AuthorizedTypedRequest } from "./express.d";
export type { RequestContext, AuthorizedRequestContext } from "./express.d";

