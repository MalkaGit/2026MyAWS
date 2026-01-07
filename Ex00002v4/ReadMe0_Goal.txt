TOD: REFINE the layers by ther readme in the layes 
Goal 
    monolith app 
    run locally - songs agains MySql without ORM 

    features: 
        - request context 
        - auth middleware 
        - request validator (using zod to get typed request)
        - request logging 

    skipped: where query support 
    skipped: complete JWT (assued behind api gw)


    Good:
    - avoid as , any 
    - less interface 
    - api i can reuse (replace repo without chaning deoman)
    - seperation - idea is good but folder structure makes it hard to refactor to microsercies 
        app - express fw 
            appApi - not used 
                the DTOs are not used . use doamin 
                xModel, xSchema xMapper 
                
            appControllers - thin !!
            appMiddleares  - reusable 
            appTypes
        domain - agnostic to fw, lib, repo , cloud etc
            idea: should not change as we change cloud, fw , lib, repo, other infra (talking to outside world - eg, sqs )
            dommainErrors 
            DomainMoels 
                note: most are used as dtos 
                we add dto only if the domain model does not match 
            DomainServics 
            DomainUseCases \ DomainOrch \ domainManager \ domainCommands - no
                optional: call services 
            domain interfaces  - not used for simpliciry 
                domain.interfaces.db - non , simplified 
                domain.interfaces.repositories - no , simplified 
                domain.interfaces.infra - no 
                    talking to external workd etc 
                domain.interfaces.utils - 
                    library wrappers  
                    all layers can use 
                    should provide api that is not depeanden on the real worlds 
       
    BAD: using modules (folders) by layers makes it hard to move to microservices 

    - REMOTE mySql db 
    - Access with mysql2 (no ORM)



Sanity 

    GET http://localhost:3000/api/songs
    -H "x-user-id: regine" 
    (see i added default offet, limit, sort)

    GET http://localhost:3000/api/songs/{some id}
    -H "x-user-id: regine" 

    Create song and see id
    curl -i -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d "{\"title\":\"title 10\", \"artistId\": \"88939d74-dffd-11f0-87a2-0afd50b0f46d\"}"  -H "x-user-id: regine" 

    Update song (eg single field) 
    curl -i -X PATCH http://localhost:3000/api/songs/39606de9-131e-4fcb-955d-c9a942fa46ea -H "Content-Type: application/json" -d "{\"title\":\"Updated 0501\"}" -H "x-user-id: regine" 

    Delete 
    curl -i -X DELETE http://localhost:3000/api/songs/d64a6577-e4ca-4ae6-8358-cbd8191edc91 -H "x-user-id: regine" 

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