Below are the steps to create app using lib from scrarch 
Note: you can copy it all to start new project 


=============================================
how to run this template
=============================================
cd to the serverWorkspace
cd lib-common
npm install 
npm run build 
cd..
cd app-rest-api
npm install
npm run build 
npm start 

=============================================
How to reuse this template
=============================================
copy the contest to some test folder 
remove node_modlues from lib_common an app-rest-api if exists 

build lib-common
test\template002__node_app_with_logger\serverWorkspace\lib-common>npm install
test\template002__node_app_with_logger\serverWorkspace\lib-common>npm run build
build app-rest-api 
test\template002__node_app_with_logger\serverWorkspace\lib-common>cd..
test\template002__node_app_with_logger\serverWorkspace>cd app-rest-api
test\template002__node_app_with_logger\serverWorkspace\app-rest-api>npm install
test\template002__node_app_with_logger\serverWorkspace\app-rest-api>npm run build
run app-rest-api
test\template002__node_app_with_logger\serverWorkspace\app-rest-api>npm start



===============================================
How to create this template from scratch 
app package using lib package
when we build the lib package, the app autoamtically uses the new lib files 
==============================================
1. close older commits 
git status
git branch
git switch <branch name>
git add .
git commit -m "..."
git push origin <branch name>

2.create new branch 
git branch
git switch <source branch>
git switch -c <new branch>
mkdir <my root ,eg template002>
cd <the foler above>

3. plan workspace 
eg, server workspace folder and in it app-rest-api and lib-common


4. create lib package

4.1 mkdir serverWorspace, cd serverWorkspace
4.2 mkdir lib-common, cd lib-common
4.3 npm init -y   (crates package.json)
4.4 npm install --save-dev typescript  (adds typescript package)
4.5 npx tsc --init
4.6 *** replace the content of tsconfig.json with the onne here ***
4.7 npm install (install the packages in packages.jon into lib_modules)
4.8 implement logger1 module
    add serverWorkspace\,ib-commn/src/utils/logger1/logger1.ts (file module)
    add index.ts in te same foler to make it folder module 
    add index/ts in serverworkspace/lib-common/src/index.ts  to make it package module 

4.9 to build the lib common  
    cd lib-common 
    npm install
    npm run build 
    note: if it fails , ***replace the package.json from this example ***

4.10 see output 
     serverworkspace\lib-common\dist 



5. create app package

5.1 cd serverworkspace
5.2 mkdor app-rest-api, cd app-rest-api
5.3 npm init -y 
5.4 npm install --save-dev typescript  (adds typescript package)
5.5 npx tsc --init (add tsconfig.json)
5.6 ****replace tsconfig.json (take it from referece)***
5.7 add serverweokspace\app-rest-api\src\server.ts
    note: the import has error
6.8 add dependency 
 **** open package.json of the app-rest-api 
 add to its dependency the lib-commn *****
     -see this example 
6.9 critical
    cd serverworkspace\app-rest-api  
    npm install  
    (reads package.jsonand writes the lib-common in the node_modules of the app)

    => now you can see that the import in server.ts works 

6.10 *** replace  the script section
      in the package.json of te app-rest-api **


7. to build the app
cd serverWorkspace
cd app-rest-apinpm run build
npm start 


8. as you change the lib-commom

cd serverWorkspace
cd lib-common 
npm run build 
(the app-rest-api will use the new lib without rebuilding te app-rest-api)
    