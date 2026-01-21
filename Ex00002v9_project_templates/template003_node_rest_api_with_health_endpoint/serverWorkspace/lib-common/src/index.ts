/**
 * PACKAGE PUBLIC API
 * ==================
 * This is the package entry point.
 * It defines modules that can be imported by package name.
 * So if we change the file name or the folder name,
 * the import statement will still work.
 */

// Line below allows: import { Logger1 } from "lib-common"  (that is te package name in package.json)
export { Logger1 } from "./utils/logger1";

