/**
 * Validation Schemas - Common Information
 * 
 * Goal:
 *  Validate request shape and types at HTTP boundary using Zod
 *  Provide stable, machine-readable error reasons
 *  Reject unknown fields (security best practice)
 * 
 * Responsibilities (All Schemas):
 *  - Validate request structure and types at HTTP boundary
 *  - Ensure required fields are present and properly formatted
 *  - Validate optional fields format when provided
 *  - Reject unknown fields (security best practice via .strict())
 *  - Provide machine-readable error codes for API consumers
 * 
 * Usage (All Schemas):
 *  - Wired via createRequestValidator({ body/query/params: schemaName })
 *  - Validates request data before it reaches the controller
 *  - On validation failure: returns 400 Bad Request with error details
 *  - On validation success: request proceeds to controller
 * 
 * Request Parts:
 *  - body: JSON payload (e.g., POST /songs request body)
 *  - query: Query string parameters (e.g., ?fields=title,url&include=artist)
 *  - params: URL path parameters (e.g., /songs/:id)
 * 
 * Architecture Principles:
 * 
 * 1. Clean Separation:
 *    - Controller and domain don't need to handle validation
 *    - Domain layer remains validation-library free (no Zod in domain)
 *    - Single validation middleware for all endpoints (all schemas)
 * 
 * 2. Library Coupling:
 *    - Zod schemas are tied to Zod library
 *    - Used ONLY at HTTP boundary
 *    - Domain layer remains library-free, so we don't need to test domain when switching libs (e.g., Joi)
 * 
 * 3. Framework Agnostic:
 *    - Schemas are HTTP-agnostic
 *    - Schemas are framework-agnostic (Express, Fastify, Next.js, etc.)
 *    - Schemas are cloud-agnostic (AWS, Azure, GCP, local)
 *    - Middleware is tied to framework (Express) - thin and easy to replace
 * 
 * 4. Schema Structure:
 *    - Each schema matches its corresponding domain model structure
 *    - Schemas use .strict() to reject unknown fields (security)
 *    - Validation happens before domain layer receives data
 * 
 * Error Response Format:
 * 
 *  On validation failure, returns:
 *    Status: 400 Bad Request
 *    Body: {
 *      code: 'REQUEST_VALIDATION_FAILED',
 *      errors: [
 *        { field: 'title', code: 'too_small' },
 *        { field: 'artistId', code: 'invalid_string' }
 *      ]
 *    }
 * 
 *  Error codes:
 *    - 'invalid_type': Wrong type (e.g., number instead of string)
 *    - 'too_small': Value too small (e.g., empty string for required field)
 *    - 'too_big': Value too big (e.g., exceeds max length)
 *    - 'invalid_string': Invalid format (e.g., invalid UUID, invalid URL)
 *    - 'unrecognized_keys': Unknown fields in request
 *    - 'custom': Custom validation errors (from refine())
 * 
 * Testing:
 * 
 *  import { schemaName } from './schemaName.schema';
 * 
 *  // Valid input
 *  schemaName.parse({
 *    field1: "value1",
 *    field2: "value2"
 *  }); // ✅ Passes
 * 
 *  // Invalid input
 *  try {
 *    schemaName.parse({
 *      field1: "",
 *      field2: "invalid"
 *    });
 *  } catch (e) {
 *    console.error(e.errors); // ❌ Shows validation errors
 *  }
 * 
 * Schema-Specific Information:
 *  - Each schema file should document:
 *    - Which endpoint it validates (e.g., POST /songs)
 *    - Which request part it validates (body/query/params)
 *    - Field-specific validation rules
 *    - Any unique validation logic
 *    - Domain model it maps to (e.g., SongCreateInput)
 */
