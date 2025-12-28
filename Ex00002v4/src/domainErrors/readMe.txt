Goal: 
    The service layer is responsible for business logic  
    and throws domain-specific errors (NotFoundError, BadRequestError, etc.). 

    NotFoundError 
    BadRequestError 
    ForbiddenError 
    ConflictError 

clean
    HTTP agnostic (App will map it to http error)

    Note:
        Each error  inherit from a common base (DomainError). 
        Each error has a default message but can be overridden. 
        Keeps service layer clean: you throw meaningful exceptions instead of generic Error. 

 
Flow 
    service layer throws domain-specific errors
    (NotFoundError, BadRequestError, etc.).
        Note:  domain-specific errors do not contain http error code !!!
               domain logic is decoupled from HTTP concerns
    
    Controller or middleware (a global error handler):  
    catch errors and map them to HTTP responses.  
    and decides how to map domain errors to HTTP responses

 
Benefits 

✅  services remain HTTP-agnostic. Dont know http error oce 
This pattern is sometimes called “exception translation at the boundary” — the service throws domain errors, and the controller or middleware translates them into external responses (HTTP, gRPC, etc.). 
✅ when using middlware, Controllers remain clean (no try/catch in every method). 
✅ when using middlware,  we have Centralizes error-to-HTTP mapping. 

Easy to maintain and consistent across the API. 

 

Alternative: Global Error Handling / Middleware 

Instead of catching errors in every controller method,  
many frameworks (Express,NestJS, Fastify)  
use global error handling middleware: 

 

 

 