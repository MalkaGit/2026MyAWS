/**
 * PACKAGE PUBLIC API
 * ==================
 * This is the package entry point.
 * It defines modules that can be imported by package name.
 * So if we change the file name or the folder name,
 * the import statement will still work.
 */

// Line below allows: import { Logger1 } from "@mycompanyname/lib-common"  (that is te package name in package.json)
export { Logger1 } from "./utils/logger1";


// Line below allows: import { withRequestContext, requestContext } from "@mycompanyname/lib-common";
export { withRequestContext, requestContext } from "./utils/request-context";

// Line below allows: import { logger } from "@mycompanyname/lib-common";
export { logger } from "./utils/logger";
