Responibilities:
        errorMiddleware - Handles service errors for all controllers

used libraries:
        express    not agnostic,  tied to fw (express)

Not clean (Industry best practices) 
        error middleware is not fw agnostic  (here. express. others Fastify, Next etc)
    
Clean:
        the logic of mapping the Exception to http status code is done once in the global error handler
        