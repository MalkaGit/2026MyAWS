Clean
    

    Helper  functions  (usally, library wrappers)
    No connections, no external calls
    can be used by all layers
        (so we can switch libray without chaning or testing consumers)
    usually provide abstract api that is library agnostic   
        so consumers do no chnage as we change wrapped library    
    db agnotstic, shuld not change as we switch db
    cloud agnostic, should not chnage as we switch cloud provider
    fw agnistic, should not change as we switch fw (Express, NextJs, Fastify)
    stateless
    can not use app or domain layers  


Example
Logging	logger.ts wrapper around Pino or Winston
Request context	request-context.ts wrapping Node AsyncLocalStorage
UUID generator	uuid.ts
Date/time formatting	dateUtils.ts

Characteristics:



    


;
