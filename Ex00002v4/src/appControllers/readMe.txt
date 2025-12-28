Not clean (Industry best practices) 
        controller is not fw agnostic  (here. express. others Fastify, Next etc)
    
Clean:
        controller catches any Exception and pass it to global error handler
        the logic of mapping the Exception to http status code is done once in the global error handler
        
        