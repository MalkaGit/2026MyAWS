Domain Services - Summary
==========================

Goal:
-----
The service layer is responsible for business logic and coordinates between the controller (presentation layer) and repository (data access layer). It validates business rules only and throws domain-specific errors.

Key Characteristics:
--------------------

1. Framework Agnostic
   - Works with Express, Fastify, NestJS, or any Node.js framework
   - No framework-specific dependencies
   - Can be reused across different web frameworks

2. Database Agnostic
   - Works with MySQL, PostgreSQL, MongoDB, DynamoDB, Elasticsearch, etc.
   - Depends on repository interface, not database implementation
   - Easy to switch databases by changing repository import

3. Clean Architecture
   - Contains pure business logic
   - No HTTP concerns (no status codes, no request/response objects)
   - No database concerns (no SQL, no database-specific code)
   - No structural validation (handled by request validation middleware)

Service Layer Flow:
------------------

1. Receive Domain Model (Request)
   - Controller passes domain model input to service
   - Service receives domain models, not DTOs or HTTP objects
   - Service trusts that input is structurally valid (request validation middleware guarantees this)

2. Validate Business Rules
   Service performs business rule validation only:
   
   a) Business Rule Validation
      - Validates according to business logic rules
      - Example: "At least one field must be provided for partial update"
      - Example: "Sorting by artist_name requires include[artist]=true"
      - Example: "Artist must exist when creating/updating song" (cross-entity validation)
   
   b) Security Validation (Business Rules Related)
      - Whitelist validation for business operations (prevents injection attacks)
      - Example: Validates allowed sort fields against whitelist
      - Example: Validates allowed field selections for queries
      - Note: Format validation (UUID, URL, etc.) is handled by request validation middleware

3. Call Repository
   - Passes domain model or relevant data to repository
   - Repository handles all database-specific operations
   - Service doesn't know about SQL, MongoDB queries, etc.

4. Validate Repository Response
   - Ensures response meets expectations (domain model or primitive)
   - Checks for business rule violations
   - Example: Validates that song exists before returning (throws NotFoundError)

5. Throw Domain-Specific Errors
   - Throws domain errors (NotFoundError, BadRequestError, etc.)
   - Errors are HTTP-agnostic (no status codes)
   - Controller/middleware maps to HTTP responses

6. Return Response
   - Returns domain model or primitive to controller
   - Response is ready for controller to return to client

Validation Responsibilities - Clear Separation:
-----------------------------------------------

Service Layer Validates (Business Rules):
    ✅ Business rules (e.g., partial update must have at least one field)
    ✅ Business logic (e.g., sorting by related fields requires include)
    ✅ Security - business operations (e.g., whitelist for sort fields, field selections)
    ✅ Cross-entity validation (e.g., artist must exist)
    ✅ Entity existence checks (business rule: resource must exist)

Service Layer Does NOT Validate (Structural Validation):
    ❌ Request structure/schema (handled by request validation middleware)
    ❌ Field types/format (handled by request validation middleware)
    ❌ Required fields (handled by request validation middleware)
    ❌ Empty strings (handled by request validation middleware)
    ❌ ID format/UUID format (handled by request validation middleware)
    ❌ HTTP-specific concerns
    ❌ Database constraints (handled by repository/database)

Structural Validation - Industry Best Practice:
-----------------------------------------------

Principle: Each layer validates at its boundary

✅ Request Validation Middleware (HTTP Boundary)
   - Validates all structural/format validation for HTTP requests
   - Validates: required fields, field types, formats (UUID, URL), empty strings, etc.
   - Runs before service layer is called
   - Service layer trusts that HTTP input is structurally valid

✅ Service Layer (Business Logic Boundary)
   - Validates business rules only
   - Does NOT duplicate structural validation
   - Assumes input is structurally valid
   - Focuses on business logic validation

✅ Non-HTTP Callers (Message Queues, Background Jobs, Other Services)
   - Responsible for validating their own inputs before calling service
   - Each caller validates at its own boundary
   - Service layer trusts the contract from callers
   - Follows DRY principle: don't duplicate validation

Why This Approach:
  1. Single Responsibility: Each layer validates what it knows about
  2. DRY Principle: Don't duplicate validation logic
  3. Clean Architecture: Service layer is independent and reusable
  4. Trust Boundaries: Validate at system boundaries, trust within
  5. Industry Standard: Matches Spring Boot, NestJS, Express patterns

Error Handling:
--------------

Service throws domain-specific errors:
    - NotFoundError: Resource not found (e.g., song doesn't exist)
    - BadRequestError: Business rule violation (e.g., invalid sort field, missing required business data)
    - ForbiddenError: Operation not allowed by business rules
    - ConflictError: Conflict occurred (e.g., duplicate entry)

Errors are:
    - HTTP-agnostic (no status codes)
    - Domain-focused (business-oriented messages)
    - Mapped to HTTP responses by controller/middleware

Shared Validators (Postponed to Phase 1):
----------------------------------------

Goal: Create reusable validators for common query patterns

getAllValidator - Validates:
    - Allowed fields (field selection whitelist)
    - Allowed includes (expansion whitelist)
    - Allowed sort keys (sort field whitelist)
    - Pagination rules (limit, offset validation)

Characteristics:
    ✅ Cloud agnostic (AWS, Azure, GCP, etc.)
    ✅ Database agnostic (MySQL, PostgreSQL, MongoDB, DynamoDB, Elasticsearch)
    ✅ Framework agnostic (Express, Next.js, Fastify)
    ✅ Domain agnostic (works for songs, artists, or any entity)

Postponed Features (Phase 1):
----------------------------

1. Complex Query Validation
   - Get all query validation (fields, includes, sort, pagination)
   - Get by ID query validation

2. Related Entity Validation
   - Validate artist exists when creating/updating song
   - Cross-entity business rule validation

3. Flexible Error Handling
   - Consider adding throwOnNotFound parameter to update/delete
   - Allows calling with:
     * true: from controller (throws NotFoundError)
     * false: for internal usage (returns boolean)

Benefits:
---------

✅ Separation of Concerns
   - Business logic isolated from presentation (controller) and data access (repository)
   - Validation responsibilities clearly separated

✅ Testability
   - Pure functions with domain models
   - Easy to unit test without HTTP or database
   - No need to mock request validation

✅ Reusability
   - Can be used by different controllers (REST, GraphQL, gRPC)
   - Can work with different databases
   - Can be called from non-HTTP contexts (with caller validation)

✅ Maintainability
   - Business rules centralized in one place
   - Easy to update business logic without touching other layers
   - No duplicate validation logic to maintain

✅ Flexibility
   - Framework-agnostic (switch frameworks without changing service)
   - Database-agnostic (switch databases without changing service)
   - Protocol-agnostic (HTTP, message queues, etc.)

Example Flow:
------------

HTTP Request Flow:
    HTTP Request 
      → Request Validation Middleware (structural validation)
      → Controller 
      → Service (business rule validation)
      → Repository 
      → Service (response validation)
      → Controller 
      → HTTP Response

Non-HTTP Flow:
    Message Queue / Background Job / Other Service
      → Caller validates input (at its boundary)
      → Service (business rule validation)
      → Repository
      → Service (response validation)
      → Caller

Error Flow:
    Service throws Domain Error 
      → Controller/Middleware catches
      → Maps to HTTP Response (status code, error format)
      → Returns to client

Best Practices:
--------------

✅ Validate all business rules in service layer
✅ Do NOT duplicate structural validation (handled by request validation middleware)
✅ Throw domain-specific errors (not generic Error)
✅ Keep service layer framework and database agnostic
✅ Use domain models for all inputs and outputs
✅ Validate against whitelists for security (business operation validation)
✅ Document business rules clearly
✅ Trust input is structurally valid (validated at boundary)
✅ For non-HTTP callers: validate at caller boundary, not in service

Anti-Patterns to Avoid:
-----------------------

❌ Don't validate structure in service layer (request validation middleware handles this)
❌ Don't validate ID format in service layer (handled by request validation middleware)
❌ Don't validate required fields in service layer (handled by request validation middleware)
❌ Don't throw HTTP-specific errors (use domain errors)
❌ Don't depend on HTTP request/response objects
❌ Don't duplicate validation logic across layers
