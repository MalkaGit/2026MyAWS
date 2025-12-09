Steps
1. develop locally 
1.1 create node projet
    mkdir my-node-app
    cd my-node-app
    npm init -y     //initalize node poject - creating package.json


1.3 ceate code files 
    sever.js
    index.js

1.4 install any package you need (adds to package.json and to node_modules)
    here, we dont need it 
    eg, npm install express

1.5 if you got package.json with dependencies call
    npm install 





2. test locally 
 "C:\Program Files\nodejs\node.exe" server.js
  postman GET http://localhost:3000/songs
          GET http://localhost:3000/songs/1



3. to deploy on aws
   helper: https://www.youtube.com/watch?v=jRQNti30Pu8
   (see mail regine.issan.jobs@gmail.com AWSEx0001)
3.1 zip 
    Note: here, we only zip one file. 
          if needed other files o node_modules, change command 
    flow poweshell:
    Compress-Archive -Path index.js  function.zip -Force

3.2 Create aws lambada to work with function url 
    aws lambada and function ul: how to deploy and test    

3.3 test the aws (for now, the /songs and /songs/1)

3.4 delete the aws lambda (to stop chaging)

4. see console.logs in cloud watch

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

