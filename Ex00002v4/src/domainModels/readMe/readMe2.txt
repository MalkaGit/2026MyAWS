Domain Models - Summary
========================

Goal:
-----
Domain models define the core data structures used across all layers of the application (repositories, services, controllers). They represent the business domain entities and their operations.

Key Characteristics:
--------------------
1. Shared Across All Layers
   - Used by repositories, services, and controllers
   - Single source of truth for domain entity structure
   - No layer-specific variations (unless REST API requires different format)

2. Well-Documented with JSDoc
   - Clear documentation explaining purpose and usage
   - Comments explain field behaviors (undefined vs null semantics)
   - Matches real-world API patterns and best practices

3. Type Safety
   - TypeScript interfaces provide compile-time type checking
   - Clear distinction between optional fields (undefined) and nullable fields (null)
   - Examples:
     * x?: string - allows string and undefined but not null
     * x?: string | null - allows string, undefined, or null

Domain Model Types:
------------------

1. Entity Models (Output)
   Example: Song
   - Represents the domain entity as returned from read operations
   - Used by services and repositories for read operations
   - Supports field selection and optional expansion

2. Input Models (Create)
   Example: SongCreateInput
   - Defines required and optional fields for creation
   - Used by services for create operations
   - Required fields are non-optional (must be provided)

3. Input Models (Update)
   Example: SongUpdateInput
   - Defines partial update structure (all fields optional)
   - Used by services for update operations
   - Undefined = don't update, provided value = update
   - Supports null for explicitly setting fields to null

4. Query Models
   Examples: SongsQuery, SongQuery
   - Define query parameters for read operations
   - Include field selection, pagination, sorting, expansion options

DTO Philosophy (Data Transfer Objects):
---------------------------------------

Principle: DO NOT create DTOs unless REST API requires different format than domain model

Default Approach:
    ✅ Use domain models directly across all layers
    ✅ No DTOs needed when domain model matches API requirements
    ✅ Simpler, less mapping code, fewer abstractions

When DTOs Are Needed:
    If REST API requires a model that differs from domain model:
    
    Controller Layer:
        - Controller defines DTO (if needed)
        - Controller API works with DTO
        - Maps request DTO → domain model (for service calls)
        - Maps domain model → response DTO (for client responses)
    
    Service Layer:
        - Service API works with domain models
        - Service doesn't know about DTOs
        - Service receives domain models, returns domain models

Flow Example (With DTOs):
-------------------------
Client Request (DTO) 
    → Controller (receives DTO)
    → Controller maps DTO to Domain Model
    → Service (works with Domain Model)
    → Repository (works with Domain Model)
    → Service returns Domain Model
    → Controller maps Domain Model to DTO
    → Client Response (DTO)

Flow Example (Without DTOs):
----------------------------
Client Request 
    → Controller (receives Domain Model)
    → Service (works with Domain Model)
    → Repository (works with Domain Model)
    → Service returns Domain Model
    → Controller (returns Domain Model)
    → Client Response

Benefits of Minimal DTO Approach:
---------------------------------
✅ Less code - no unnecessary mapping layers
✅ Simpler architecture - fewer abstractions
✅ Faster development - reuse domain models
✅ Type safety maintained throughout application
✅ Easier to maintain - single source of truth

Key Design Patterns:
-------------------

1. Undefined vs Null Semantics
   - undefined: Field not selected/provided (e.g., field selection in queries)
   - null: Field explicitly set to null (e.g., removing optional data)
   - Type system enforces correct usage

2. Field Selection Support
   - Entity models support partial field selection
   - Some fields always returned (e.g., id)
   - Other fields are optional (undefined when not selected)

3. Optional Expansion
   - Related entities can be expanded when requested
   - Example: Song.artist is populated only when include=artist is requested
   - Keeps responses lean by default

4. Partial Update Pattern
   - Update input models have all fields optional
   - Undefined means "don't change this field"
   - Provided value means "update to this value"
   - Null means "explicitly set to null"

Best Practices:
--------------
✅ Domain models should represent business concepts, not technical concerns
✅ Use clear, descriptive names that match domain language
✅ Document field semantics clearly (undefined vs null)
✅ Keep domain models independent of presentation layer needs
✅ Only create DTOs when API requirements diverge from domain model
✅ Prefer domain model reuse over creating new DTOs

