

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
test:  http://localhost:3000/health

note: you can try changing .env file settings
      -no env file 
      -change the settings to see how it affects the format and log level
       (see below)



       
===========================================
hot to develop ?
=============================================
how to develop: create project
phase10.0 - copy from tempate3
=============================================
copy template3 workspace into this folder
remove node_modlues from lib_common an app-rest-api if exists 

build lib-common
Ex0002v010_operation1_register_user_v2\serverWorkspace\lib-common>npm install
Ex0002v010_operation1_register_user_v2\serverWorkspace\lib-common>npm run build

build app-rest-api 
Ex0002v010_operation1_register_user_v2\serverWorkspace\lib-common>cd..
Ex0002v010_operation1_register_user_v2\serverWorkspace>cd app-rest-api
Ex0002v010_operation1_register_user_v2\serverWorkspace\app-rest-api>npm install
Ex0002v010_operation1_register_user_v2\serverWorkspace\app-rest-api>npm run build
run app-rest-api
Ex0002v010_operation1_register_user_v2\serverWorkspace\app-rest-api>npm start

=============================================
how to develop: register user
=============================================

-creare users table in  my sql table 
    see in repositry
-reate thye users.types in app-rest-api\src\modules\users\types 
    user.register.input.schema.ts
     user.register.input.ts
      user.register.output.schema.ts
-implement the respository
-implement error codes
-inplement service
-implement controller
-implement rounre
-export router and use it in the app
add env file
test as below


=============================================
How to Test: register user
=============================================
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('listener','artist','admin') DEFAULT 'listener',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Example1:
POST http://localhost:3000/users/register
Content-Type application/json
{
    "email": "email2@gmail.com",
    "password":"aA123456789"
}

result:
400 Bad request
{
    "code": "USER_PASSWORD_TOO_WEAK",
    "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
}


Exmple2:
POST http://localhost:3000/users/register
Content-Type application/json
{
    "email": "email3@gmail.com",
    "password":"aA123456789!"
}

results:
201 created
{
    "id": "1482aeff-f30d-45fc-9f9c-04bdd911f6d0"
}


Example3:
POST http://localhost:3000/users/register
Content-Type application/json
{
    "email": "email3@gmail.com",
    "password":"aA123456789!"
}

result
{
    "code": "USER_ALREADY_EXISTS",
    "message": "User with email email3@gmail.com already exists"
}

