Steps
1. develop locally 
1.1 create node projet
    mkdir my-node-app
    cd my-node-app
    npm init -y     //initalize node poject - creating package.json
1.2 add .gitignore
    
    node_modules/
    .env

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
3.1 zip 
    Note: here, we only zip one file. 
          if needed other files o node_modules, change command 
    flow poweshell:
    Compress-Archive -Path index.js  function.zip -Force

3.2 Ceate aws lambada to work with function url 

3.2.1 login to aws managment console 
3.2.2
3.2.3



10. git
10.1 ceate git accountId
10.2 commiting
      git init
      git add .
      git commit -m "Initial commit"
10.3 pushing

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

