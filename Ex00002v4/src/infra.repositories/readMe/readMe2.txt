Repository Pattern - Summary
=============================

Goal:
-----
The repository layer isolates database-specific code from domain logic, providing a clean abstraction for data access operations.

Responsibilities:
-----------------
✅ Building queries (SQL, MongoDB queries, etc.)
✅ Mapping database fields to domain fields (read operations)
✅ Mapping domain fields to database fields (write operations)

Clean Architecture Principles:
------------------------------

1. NO Defaults in Repository Layer
   - Repositories do NOT provide defaults for inputs (page size, offset, limit)
   - Let controller/service layer handle defaults
   - Allows repositories to be reused by different consumers with their own defaults

2. NO Validation in Repository Layer
   - Services validate business logic (e.g., partial update has at least one field)
   - Request validation middleware validates request structure (field types, formats)
   - Repository focuses solely on data access, not business rules

3. NO Business Validation Errors
   - Repositories may throw unexpected database errors
   - They do NOT throw business validation errors
   - Validation is the responsibility of service layer and middleware

4. Easy Database Switching
   - Each database has separate directories
   - Switching requires only changing import paths in domain services
   - Repository interface remains the same regardless of database

Database Switching Strategies:
------------------------------

Option 1: Database-Specific Directories (RECOMMENDED) ✅
Structure:
    infra.repositories/
        mySql/
            db.ts                    # MySQL connection
            songRepository.ts        # MySQL implementation
        mongo/
            db.ts                    # MongoDB connection
            songRepository.ts        # MongoDB implementation

How to Switch:
    1. Create new database directory
    2. Implement db.ts and repository files with same function signatures
    3. Update import in domainServices:
       FROM: import * as songRepo from "../infra.repositories/mySql/songRepository";
       TO:   import * as songRepo from "../infra.repositories/mongo/songRepository";

Pros:
    ✅ Clear separation by database type
    ✅ Easy to switch: just change import path
    ✅ Self-contained: each database has own connection and repository
    ✅ No abstraction overhead
    ✅ Simple and maintainable
    ✅ Industry-standard pragmatic approach

Cons:
    ⚠️  Function signatures must match manually (not enforced by TypeScript)
    ⚠️  Cannot run multiple databases simultaneously (not needed in microservices)

Option 2: Single File Override
- Replace entire repository file when switching
- Simplest but loses ability to easily switch back
- Harder to compare implementations

Option 3: Interface Abstraction with Factory
- Uses interfaces and factory pattern
- TypeScript enforces function signatures
- Can support multiple databases simultaneously
- More complex, overkill for single-database microservices

Recommendation:
---------------
Use Option 1 (Database-Specific Directories)

Why:
    ✅ Best balance of simplicity and flexibility
    ✅ Industry-standard pragmatic approach
    ✅ Easy to switch databases
    ✅ Clear organization
    ✅ No unnecessary abstraction overhead
    ✅ Perfect for microservices (single database at a time)

Key Design Decisions:
--------------------
- Repository interface (function signatures) is implicit, not explicit
- All repositories for same entity have identical function signatures
- Domain services depend on repository functions, not concrete implementation
- Database-specific code is completely isolated in repository layer
- Repository layer has no knowledge of HTTP, business rules, or defaults

Example Flow:
-------------
Controller → Service Layer → Repository Layer → Database
           (validation)      (data access)

The repository is the only layer that knows about SQL, MongoDB queries, 
field mappings, and database connection details.

