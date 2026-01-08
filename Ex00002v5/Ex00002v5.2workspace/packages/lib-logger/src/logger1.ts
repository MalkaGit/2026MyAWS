/**
 * FILE MODULE (FUNCTION-BASED)
 * ===========================
 * Equivalent to static utility in C#
 */

//the export statement is file module entry point
//it allows import by filename
//line below allows: import { logWithLogger1 } from "./logger1";
//so, if we change the file name,
//the import statement will break
export function logWithLogger1(message: string): void {
    console.log(`[Logger1] ${message}`);
  }