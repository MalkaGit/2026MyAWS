
Goal:
    Database access layer - isolates database-specific code from domain logic

Responsibilities: 
   - Building queries (SQL, MongoDB queries, etc.)
   - Mapping database fields to domain fields (read operations)
   - Mapping domain fields to database fields (write operations)
    1.  prevent sql injection by ussing Parameterized queries:
        all user input uses ? placeholders
    2. Field name mapping: domain names mapped to safe DB column names
    3. Whitelist validation: 
    service layer validates sort fields
    4. Defense in depth: repository also enforces whitelist (no fallback)

Clean Architecture Principles:
    0. Repositories do NOT provide defaults for inputs (e.g., page size, offset, limit)
        - Let the controller/service layer handle defaults
        - This allows repositories to be reused by different consumers, letting each consumer decide on defaults
    
    1. Repositories do NOT perform validation
        - Services validate business logic in domain layer
            eg, partial update request has at least one field)
            eg, if we sort by artist name, service layer ensures it is included
        - Request validation middleware validates the structure of the request (e.g., field types)
    
    2. Repositories do NOT throw validation errors
        - They may throw unexpected database errors, but not business validation errors
    
    3. Easy database switchin
        - Each database has separate directories
        - Switching databases requires only changing import paths in domain services
        - songRepository has same interface regardless of the db 

DATABASE SWITCHING STRATEGIES

Option 1: Database-Specific Directories (RECOMMENDED) ✅
    Structure:
        infra.repositories/
            mySql/
                db.ts                    # MySQL connection
                songRepository.ts        # MySQL implementation
            mongo/
                db.ts                    # MongoDB connection
                songRepository.ts        # MongoDB implementation
            elastic/
                db.ts                    # Elasticsearch connection
                songRepository.ts        # Elasticsearch implementation
    
    How it works:
        - Each database has its own directory with db.ts and repository files
        - All repositories implement the same function signatures (implicit contract)
        - Domain services import from the active database directory
    
    How to switch:
        1. Create new database directory (e.g., mongo/)
        2. Implement db.ts and songRepository.ts with same function signatures
        3. Update import in domainServices/songService.ts:
           FROM: import * as songRepo from "../infra.repositories/mySql/songRepository";
           TO:   import * as songRepo from "../infra.repositories/mongo/songRepository";
    
    Pros:
        - Clear separation by database type
        - Easy to switch: just change import path
        - Self-contained: each database has its own connection and repository
        - No abstraction overhead
        - Simple and maintainable
        - Industry-standard pragmatic approach
    
    Cons:
        - Function signatures must match manually (not enforced by TypeScript)
        - Cannot run multiple databases simultaneously (not needed in microservices)


Option 2: Single File Override
    Structure:
        infra.repositories/
            songRepository.ts            # Replace entire file when switching
    
    How to switch:
        - Replace songRepository.ts with new database implementation
        - Replace db.ts with new database connection
    
    Pros:
        - Simplest approach
        - Minimal file structure
    
    Cons:
        - Lose ability to easily switch back
        - Cannot support multiple databases at once
        - Harder to compare implementations
        - No clear organization


Option 3: Interface Abstraction with Factory
    Structure:
        infra.repositories/
            interfaces/
                ISongRepository.ts       # Interface definition
            mysql/
                songRepository.ts         # Implements ISongRepository
            mongo/
                songRepository.ts         # Implements ISongRepository
            index.ts                      # Factory selects implementation
    
    How it works:
        - Interface enforces function signatures
        - Factory pattern selects implementation based on config
        - Domain services depend on interface, not concrete implementation
    
    Pros:
        - TypeScript enforces function signatures match
        - Can support multiple databases simultaneously
        - Easy to test (mock interface)
        - More "enterprise" approach
    
    Cons:
        - More abstraction overhead
        - More complex setup
        - Overkill for single-database microservices


RECOMMENDATION:
    Use Option 1 (Database-Specific Directories)
    
    Why:
        - Best balance of simplicity and flexibility
        - Industry-standard pragmatic approach
        - Easy to switch databases
        - Clear organization
        - No unnecessary abstraction overhead
        - Perfect for microservices (single database at a time)
