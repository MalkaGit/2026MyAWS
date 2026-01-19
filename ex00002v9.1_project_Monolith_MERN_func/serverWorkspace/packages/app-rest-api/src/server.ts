/**
 * APPLICATION ENTRY POINT
 * =======================
 * Equivalent to Program.cs
 */

//test logger1 module
//import Logger1 from package (thanks to index.ts in the package)
//import statement does not chnage as we move the module in the package
//import { Logger1 } from "@server/lib-common";
//const l1 = new Logger1();
//l1.log("Hello");

//test logger module
import { logger } from "@server/lib-common";
logger.info("Hello info");
logger.debug("Hello debug");

//test mysql connection module
import { testMySqlConnection } from "@server/lib-common";
testMySqlConnection();


