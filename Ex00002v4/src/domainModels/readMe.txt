
models used by the API of all layers
    (repositories, services, controllers)

Rarely: DTO
    if REST API requieres other API,
    controller define DTO
    controller API work with DTO
    service api work with domain models
    controller map request DTO to domain model and pass it to service
    contolle gets service result (domain model) , map it to DTO and retun DTO to client