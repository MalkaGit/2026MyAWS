 Responsible for business logic  (also called use cases)
 and throws domain errors

Clean 
Important
    it is framework agnostic (Express, Fastify, NestJS)
    it is db agnostic (Mongo, Dynamo, MySql, etc)

Structural Validation Note:
  Service layer does NOT perform structural validation (required fields, empty strings, ID format, etc.).
  This is handled by request validation middleware for HTTP requests.
  
  Principle: Each layer validates at its boundary
  - Request validation middleware validates HTTP requests (structural/format validation)
  - Service layer validates business rules only (business logic validation)
  
  For non-HTTP callers (message queues, background jobs, other services):
  - Callers are responsible for validating their inputs before calling service methods
  - This follows clean architecture: service layer trusts its contract
  - Duplicating validation in service layer would violate DRY principle 

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

