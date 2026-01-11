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
export {QueryInput} from "./domain/models/queryInput";
