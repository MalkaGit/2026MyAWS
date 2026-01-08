/**
 * FOLDER PUBLIC API
 * =================
 
Goal of this index file: This folder is a module
it allows import by folder name
anything exported by this file, can be imported by folder name.
*/

/**
 * FOLDER PUBLIC API
 * =================
 * This is the folder entry point.
 * it defines modules that can be imported by folder name
        so if we change the file name,
        the import statement will still work.
        but, ifwe change the folde name,
        the import statement will break
*/


//line below allows: import { logWithLogger3 } from "./logger3";
export { logWithLogger3 } from "./logger3";