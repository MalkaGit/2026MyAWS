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

c:\Repos\LearningAWS2026\Ex00002v4>
    npm run build
    npm start

postman 
    GET http://localhost:3000/api/songs

    GET http://localhost:3000/api/songs/{some id}

    Create song and see id
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 5\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 

    Update song (eg single field) 
    curl -i -X PATCH http://localhost:3000/api/songs/39606de9-131e-4fcb-955d-c9a942fa46ea -H "Content-Type: application/json" -d "{\"title\":\"Updated !!!\"}"

    Delete 
    curl -i -X DELETE http://localhost:3000/api/songs/d64a6577-e4ca-4ae6-8358-cbd8191edc91

    Delete again (same)

