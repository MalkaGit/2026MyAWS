1. just create dummy ts app as ex4
2. take code from v2 and convert to ts 
3. build error
        :\Repos\LearningAWS2026\Ex00001v5>npm run build
        > ex00001v5@1.0.0 build
        > tsc
        src/server.ts:1:42 - error TS2306: File 'C:/Repos/LearningAWS2026/Ex00001v5/src/index.ts' is not a module.

         import { handler as lambdaHandler } from "./index";  // Correct import


   try changing tsconfig.json

4. in package.json  set start to start the server
        "start": "node dist/server.js"
       //"start": "node dist/index.js"

     
5. To build and run locally 
   Then you can run:

   npm run build
   npm start