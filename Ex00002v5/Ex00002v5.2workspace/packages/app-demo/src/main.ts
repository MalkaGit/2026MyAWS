/**
 * APPLICATION ENTRY POINT
 * =======================
 * Equivalent to Program.cs
 */


//bad pactice: import by file name thanks to the export in the file istelf
//             breaks if we change the file name?
//import { Logger3 } from "../../lib-logger/dist/logger3/logger3";
import {logWithLogger2 } from "../../lib-logger/dist/logger2/logger2";
import { logWithLogger1 } from "../../lib-logger/dist/logger1";

//bad practice: import by folder name.
//the export done by index.ts in the same of the file 
// (see lib-logger/logger3/index.ts)
//import { logWithLogger3 } from "../../lib-logger/dist/logger3";

//good practice: import by package name. 
//the export done by index,ts in the package level
//(see lib-logger/index.ts next to package.json)
import { logWithLogger3 } from "@ex00002v5.2/lib-logger";




logWithLogger3("Hello from Logger3");

//Logger2 was not ment to be exported 
logWithLogger2("Hello from Logger2");

//Logger1 was not ment to be exported 
logWithLogger1("Hello from Logger1");
