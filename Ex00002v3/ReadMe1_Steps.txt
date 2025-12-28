 

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
    GET http://localhost:3000/api/songs
    GET http://localhost:3000/api/songs/{some id}

    Create song and see id
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 1\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 2\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 3\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 4\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 


    (Partial) Update song (eg single field) - EG, TITLE
    curl -i -X PATCH http://localhost:3000/api/songs/39606de9-131e-4fcb-955d-c9a942fa46ea -H "Content-Type: application/json" -d "{\"title\":\"title1 updated\"}"
   

    curl -X DELETE http://localhost:3000/api/songs/82f7844e-216f-4671-926e-1d50438cf1eb


    TODO: ALLL Get by id variations

    TODO: ALL Get ALL variations
    GET http://localhost:3000/api/songs?include=artist
    http://localhost:3000/api/songs?include=artist&fields=title
