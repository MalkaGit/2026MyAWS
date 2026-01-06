


Sanity 

    GET http://localhost:3000/api/songs
    (see i added default offet, limit, sort)

    GET http://localhost:3000/api/songs/{some id}

    Create song and see id
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 10\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}" 

    Update song (eg single field) 
    curl -i -X PATCH http://localhost:3000/api/songs/39606de9-131e-4fcb-955d-c9a942fa46ea -H "Content-Type: application/json" -d "{\"title\":\"Updated 0501\"}"

    Delete 
    curl -i -X DELETE http://localhost:3000/api/songs/d64a6577-e4ca-4ae6-8358-cbd8191edc91

    Delete again (same)


    Get by id 
    http://localhost:3000/api/songs/0ca937e2-4b2e-491b-9b43-0a80d71b6a9d?fields=title,url&include=artist
        http://localhost:3000/api/songs/0ca937e2-4b2e-491b-9b43-0a80d71b6a9d?fields=title

    Get All with paging
    http://localhost:3000/api/songs?sort=id&offset=0&limit=3&fields=title,url&include=artist
 



     Get by id  errors
     http://localhost:3000/api/songs/0ca937e2-4b2e-491b-9b43-0a80d71b6a9d?fieldsssa=title
     bad request (feidlsss)
     {
    "code": "REQUEST_VALIDATION_FAILED",
    "errors": [
        {
            "field": "root",
            "code": "unrecognized_keys"
        }
    ]
}