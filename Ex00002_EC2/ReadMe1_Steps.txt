Hello , i am new to aws and node. assume i dont know anything.
i created service class (below).

i want to expose it as rest api - Songs
first to run it locally on my machine.
then, i will upload it to aws ec2.


can you povide step by step tutoial and do not miss any step
(setup, npm install, code, ts config, test etc) assume i dont kniw 
for now, just run on my local machine.
be sure to make it poduction redy and follow industry best practices

==========================================
see coding steps in one Note
==========================================

     
2. To build and run locally
c:\Repos\LearningAWS2026\Ex00002_EC2>
    npm run build
    npm start

postman 
    GET http://localhost:3000/songs
    GET http://localhost:3000/songs/1

    curl -X DELETE http://localhost:3000/songs/1 

    Update song (eg single field) 
    curl -i -X PUT http://localhost:3000/songs/2 -H "Content-Type: application/json" -d "{\"title\":\"Updated Song 2!\"}" 

    Create song 
    curl -i -X POST http://localhost:3000/songs -H "Content-Type: application/json" -d "{\"title\":\"Song 5\",\"artist\":\"Artist 5\"}" 


