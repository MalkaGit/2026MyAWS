for X that we get from input

1. X.dto.ts (optional)
    The request DTO
    Used when the HTTP request CANT GET GET domain model

2. X.schema.ts
    The request validation schema (e.g. Zod)
    Responsible for runtime validation 
    Responsible for  parsing of incoming request data.
        (string to numbers or arrays)
    follows the schema of the  DTO if exist or by domainn model, otherwise)

3.  X.mapper.ts (optional)
    Maps the request DTO to the domain model,
    only needed when DTO and domain shapes differ.