/**
 * APPLICATION ENTRY POINT
 * =======================
 * Equivalent to Program.cs
 */


//bad pactice: import by file name thanks to the export in the file istelf
//             breaks if we change the file name?
//import { Logger3 } from "../../lib-logger/dist/logger3/logger3";
import { Logger2 } from "../../lib-logger/dist/logger2/logger2";
import { Logger1 } from "../../lib-logger/dist/logger1";

//bad practice: import by folder name.
//the export done by index.ts in the same of the file 
// (see lib-logger/logger3/index.ts)
//import { Logger3 } from "../../lib-logger/dist/logger3";

//good practice: import by package name. 
//the export done by index,ts in the package level
//(see lib-logger/index.ts next to package.json)
import { Logger3 } from "@ex00002v5.1/lib-logger";



const l3 = new Logger3();
const l2 = new Logger2();
const l1 = new Logger1();

l3.log("Hello from Logger3");

//Logger2 was not ment to be exported 
//l2.log("Hello from Logger2");

//Logger1 was not ment to be exported 
//l1.log("Hello from Logger1");
