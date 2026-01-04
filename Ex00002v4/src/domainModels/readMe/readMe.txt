
Goal
     models used by the API of all layers
    (repositories api
     services api 
     idealy -  controllers (unless api requrie diffrent struture)

Clean
1. cloud agnostic
   http agnostic 
   db agnostic 

2. Matches many real-world APIs 
   well-documented in the JSDoc.

3. about DTO
    we do not create DTO, unless Rest API require model that is not the domain model

    if REST API requieres other API,
    controller define DTO
    controller API work with DTO
    service api work with domain models
    controller map request DTO to domain model and pass it to service
    contolle gets service result (domain model) , map it to DTO and retun DTO to client