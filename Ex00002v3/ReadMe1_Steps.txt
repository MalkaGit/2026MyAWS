 

i am colpletely new to aws and node. 

i have folder with rest api code unning localy and bining data from memory. 

i have rds on aws and created there db and table. 

i want to create new app , wiith same interface on all layers  

but change the service implmentation to work with rds table. 

please povide step by step guide , assuming i am complettely new to node and rds 

(all the steps !!!! eg, to ceate the ackage json the tsconfig etc) 

please use industy best pratices. 

next steps will be on unning the code locally and then on ec2 and theen on ecs. 

table was created with 

CREATE TABLE songs ( 

id CHAR(36) PRIMARY KEY DEFAULT (UUID()), 

title VARCHAR(255) NOT NULL, 

artist VARCHAR(255) NOT NULL, 

url VARCHAR(2048) NULL 

); 

code is: 


==========================================
see coding steps in one Note
==========================================



==========================================
fill env:
==========================================
console => databases => pick db => endpoint

DB_HOST= console => databases => pick db => endpoint
DB_USER=admin
DB_PASSWORD=
DB_NAME=spotifydb
DB_PORT=3306

==========================================
 To build and run locally
==========================================

c:\Repos\LearningAWS2026\Ex00002v3>
    npm run build
    npm start

postman 
    GET http://localhost:3000/songs

    GET http://localhost:3000/songs/{some id}

    Create song and see id
    curl -i -X POST http://localhost:3000/songs -H "Content-Type: application/json" -d "{\"title\":\"title a\",\"artist\":\"Artist a\"}" 

    Update song (eg single field) 
    curl -i -X PUT http://localhost:3000/songs/82f7844e-216f-4671-926e-1d50438cf1eb -H "Content-Type: application/json" -d "{\"title\":\"Updated !\"}" 

    curl -X DELETE http://localhost:3000/songs/82f7844e-216f-4671-926e-1d50438cf1eb


