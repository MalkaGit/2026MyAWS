0. code
   just create dummy ts app as ex4
   take code from v2 and convert to ts 

     
2. To build and run locally

   in package.json  set start to start the server
        "start": "node dist/server.js"
       //"start": "node dist/index.js"


   Then you can run:

   npm run build
   npm start

         postman GET http://localhost:3000/songs
          GET http://localhost:3000/songs/1



2.5 build errors 
        
        :\Repos\LearningAWS2026\Ex00001v5>npm run build
        > ex00001v5@1.0.0 build
        > tsc
        src/server.ts:1:42 - error TS2306: File 'C:/Repos/LearningAWS2026/Ex00001v5/src/index.ts' is not a module.

         import { handler as lambdaHandler } from "./index";  // Correct import





3. to deployon aws (manually)
===============================
   helper: https://www.youtube.com/watch?v=jRQNti30Pu8
   (see mail regine.issan.jobs@gmail.com AWSEx0001)
3.1 zip 
    Note: here, we only zip one file. 
          if needed other files o node_modules, change command 

    flow poweshell:
    this version (including js from dist and package.json. 
    no need fo node_modules) 
    C:\Repos\LearningAWS2026\Ex00001v5> Compress-Archive -Path dist/index.js, dist/services, package.json -DestinationPath function.zip -Force

3.2. connect to aws console 

3.3 Create aws lambada to work with function url 
    aws lambada and function ul: how to deploy and test    

3.4 test the aws (for now, the /songs and /songs/1)

3. delete the aws lambda (to stop chaging)

3.6 see console.logs in cloud watch
   (monitor tab => view cloud watch log)



4. to deploy on aws again with script (assuming lambad aleady created on aws)
===================================================================
4.1 created script deploy.ps1 (see mail) 

4.2 PS C:\Repos\LearningAWS2026\Ex00001v5> .\deploy.ps1






5. git
5.1 ceate git account
5.2 commiting locally for first time
      in parent diectoy: git init (ceate hidden .git)
      in parent diectoy add .gitignore    
        node_modules/
        .env
      git branch
      git switch -c Ex00001
      git add .
      git commit -m "Initial commit"
5.3 ceate git repo on github (public)
5.4 git remote add origin https://github.com/MalkaGit/2026MyAWS.git
5.5 git push origin -u Ex00001

6. other commits 
    git branch
    sit switch ...
    git status ..
    git add ...
    git commit -m 
    git push oigin <banch name>

7. refactor - splitting handle to sevice and handler
   the service can be reused later
   
======

About
1. full crud of single entity with lamda and function url
Note: function url is fixed url to which we can call with GET,PUT,POST,UPDAte
      usually, for sinlge operation or single resoulrce
      dont use lamda and function url for REST api with serveral resources
        eg, song, artists

2. keep in mind that add, update, delete will not work on 
   aws bwtween calls.
   reason: we are saving in memory but lamda functions are stateless

   Lambda functions are stateless.

Each invocation may run in a new container or a cold start, so any in-memory data is lost between requests.

This means if you store new songs in an array in memory, it will work locally while your server is running, but:

On AWS Lambda, if you call POST to add a song, the next GET may not see that song, because the next invocation could run in a different Lambda instance.

