usage:

    build and run from the app folder
    Cd c:\Repos\LearningAWS2026\Ex00002v6\serverWorkspace\packages\app 

    #install dependencies 
    npm install 
    npm run build 
    npm start  
Goal:
 template for express app
    workspace (solution)
    with two packages (project)

    lib-common  
    (will be reused by all micro services when we split)
    
    app
    (right now monolith
    uses references from lib-commmon)

Clean
    - lib-common will be reused across serveral microservices (apps)
    - package export allows renaming files and folders 
      in lib-common without changing the improt statement

Skipped
    - thinking too much of the structurse in lib-common
    - thinking if lib-common should be split 
      (eg, App,domain, infra)



===========
important: 
==========
    lib-common does export from index.ts at package level (index.ts is under src)
    thus, app package can import it using 
    package name and not folder oor file name


    thus, we can just break the monolith
    to lib-common and monolith app
    without carring where we place files in lib-common

    later, we can move the in lic-common
    and that wont requrie changing import in apps
    