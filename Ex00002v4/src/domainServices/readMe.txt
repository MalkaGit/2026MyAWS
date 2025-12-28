 Responisble for  business logic 
 and throws domain errors

Clean 
Imprtant
    its is framework agnostic (Express, Fastifty,NestJs)
    it is db agnostic (Mongo, Dynamo, MySql, etc) 

Flow:
 
1. Receive **domain model (request)** from controller.
2. **Validate request** 
    according to business rules
    request validation 
    secuity validation
3. **Call repository**, passing the domain model or relevant data.
4. **Validate repository response** (ensure it meets expectations: domain model or primitive).
5. **Throw domain-specific errors** as needed (`NotFoundError`, `BadRequestError`, etc.).
6. **Return repository response** to the controller.

It accurately describes the role of a **service layer** in a layered architecture.


Postponed on phase1
1. Compplex validation: Get all Query and Get by id query  

2. Complex validation: artist exist 

3. Complex:
   Update and delete throw NotFoundException.  
    we could have added to update and delete throwOnNotFound 
    so we could call it
    with true from controller 
    false for internal usage 

