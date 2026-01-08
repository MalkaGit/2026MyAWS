/**
 * FOLDER PUBLIC API
 * =================
 * This is the package entry point.
 * it defines modules that can be imported by package name. 
        so if we change the file name or the folder name,
        the import statement will still work.
*/

//line below allows: import { logWithLogger3 } from "@ex00002v5.2/lib-logger";
export { logWithLogger3 } from "./logger3";
