Domain Errors Pattern - Summary
================================

Overview:
---------
The service layer throws domain-specific errors (NotFoundError, BadRequestError, etc.) that are HTTP-agnostic. These errors are then mapped to HTTP responses at the application boundary (controller or error middleware).

Domain Error Types:
------------------
- NotFoundError    - Resource requested does not exist
- BadRequestError  - Invalid request according to business rules
- ForbiddenError   - Operation is not allowed by business rules
- ConflictError    - Conflict occurred (e.g., duplicate entry)

Key Principles:
--------------
1. HTTP-Agnostic Domain Layer
   - Domain errors do NOT contain HTTP status codes
   - Service layer is decoupled from HTTP concerns
   - Allows reuse across different protocols (HTTP, gRPC, etc.)

2. Exception Translation at the Boundary
   - Service layer throws domain-specific errors
   - Controller/middleware translates to HTTP responses
   - Mapping logic is centralized at the application boundary

3. Inheritance Structure
   - All domain errors inherit from DomainError base class
   - Each error has a default message but can be overridden
   - Provides type safety and consistent error handling

Error Flow:
----------
Service Layer → Domain Error → Controller/Middleware → HTTP Response

Example:
-------
Service throws:  new NotFoundError("Song with id 123 not found")
Middleware maps: NotFoundError → 404 status code with error message

Benefits:
---------
✅ Services remain HTTP-agnostic - don't need to know about HTTP error codes
✅ Controllers stay clean - no try/catch needed in every method (when using middleware)
✅ Centralized error-to-HTTP mapping - consistent across entire API
✅ Easy to maintain - single place to update error handling logic
✅ Protocol flexibility - same domain errors work for HTTP, gRPC, GraphQL, etc.

Implementation Pattern:
----------------------
Instead of catching errors in every controller method, use global error handling middleware:
- Express, NestJS, Fastify support global error handlers
- Middleware catches all domain errors and maps them appropriately
- Controllers can focus on request/response handling without error boilerplate

Example Error Mapping (in middleware):
--------------------------------------
NotFoundError    → 404 Not Found
BadRequestError  → 400 Bad Request
ForbiddenError   → 403 Forbidden
ConflictError    → 409 Conflict
DomainError      → 500 Internal Server Error (fallback)

