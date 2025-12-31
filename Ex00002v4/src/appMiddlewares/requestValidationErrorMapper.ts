//8.6
/**
 * Goal:
 *  Maps Zod validation errors to stable, machine-readable error codes for API consumers
 * 
 * Error Codes Returned:
 *  - 'invalid_type': Wrong data type (e.g., number instead of string, missing required field)
 *  - 'too_small': Value too small (e.g., empty string, number below minimum, array too short)
 *  - 'too_big': Value too big (e.g., string exceeds max length, number above maximum, array too long)
 *  - 'invalid_string': Invalid string format - uses specific validation type when available:
 *     * 'uuid': Invalid UUID format (from z.uuid())
 *     * 'url': Invalid URL format (from z.url())
 *     * 'email': Invalid email format (from z.email())
 *     * 'invalid_string': Generic invalid string format (fallback)
 *  - 'unrecognized_keys': Unknown fields in request (from .strict())
 *  - 'custom': Custom validation errors from .refine() or .superRefine()
 *     * Returns the message from refine() (e.g., 'at_least_one_field_required')
 *     * Note: Schema authors must use stable error code strings, not dynamic messages
 *  - 'invalid': Fallback for unhandled Zod error codes
 * 
 * Critical Aspects:
 *  - Error codes are library-agnostic (stable even if we switch from Zod to Joi/Yup)
 *  - Field paths use dot notation for nested fields (e.g., 'user.address.city')
 *  - Root-level errors use field name 'root'
 *  - Returns array of errors (multiple validation failures possible)
 * 
 * Industry Best Practices: ✅ YES
 *  - Stable error codes (not library-specific)
 *  - Machine-readable format
 *  - Field-level error reporting
 *  - Framework-agnostic (pure function)
 */

import { ZodError, ZodIssue } from 'zod';

export interface ValidationErrorDto {
  field: string;  // Field name that caused the error (dot notation for nested, 'root' for root-level)
  code: string;   // Stable error code (library-agnostic, so we can switch validation libraries without breaking clients)
}

export function mapZodErrorToDtoErrorCode(error: ZodError): ValidationErrorDto[] {
  return error.issues.map((issue) => ({
    // Join path array with dots for nested fields (e.g., ['user', 'address'] → 'user.address')
    // Use 'root' if path is empty (root-level validation error)
    field: issue.path.length > 0 ? issue.path.join('.') : 'root',
    code: mapIssueCode(issue),
  }));
}

/**
 * Maps Zod issue code to stable error code
 * 
 * @param issue - Zod validation issue
 * @returns Stable error code string
 * 
 * Note: Uses ZodIssue type for better type safety (vs generic object)
 */
function mapIssueCode(issue: ZodIssue): string {
  // Handle Zod's discriminated union by checking code as string
  const code = issue.code as string;
  
  switch (code) {
    case 'invalid_type':
      // Wrong type: number instead of string, missing required field, etc.
      return 'invalid_type';

    case 'too_small':
      // Value too small: empty string, number below minimum, array too short
      return 'too_small';

    case 'too_big':
      // Value too big: string exceeds max length, number above maximum, array too long
      return 'too_big';

    case 'invalid_string':
    case 'invalid_format':
      // Invalid string format: uses specific validation type when available
      // issue.validation contains the specific validator type:
      //   - 'uuid' when z.uuid() fails
      //   - 'url' when z.url() fails
      //   - 'email' when z.email() fails
      //   - undefined for generic string validation failures
      // This provides more specific error codes than generic 'invalid_string'
      // Type assertion needed because ZodIssue is a discriminated union and validation
      // property only exists on certain issue types
      const validationType = (issue as any).validation;
      return validationType ?? 'invalid_string';

    case 'unrecognized_keys':
      // Unknown fields in request (from .strict() validation)
      return 'unrecognized_keys';

    case 'custom':
      // Custom validation errors from .refine() or .superRefine()
      // Returns the message from refine() validation
      // Example: songUpdateSchema.refine() returns 'at_least_one_field_required'
      // 
      // ⚠️ IMPORTANT: Schema authors must use stable error code strings in refine() messages,
      // not dynamic messages, to maintain API contract stability
      // 
      // Good: message: 'at_least_one_field_required'
      // Bad:  message: `Field ${fieldName} is required` (dynamic, breaks API contract)
      return issue.message;

    default:
      // Fallback for unhandled Zod error codes (shouldn't happen in normal operation)
      // Handles edge cases or future Zod versions that add new error codes
      return 'invalid';
  }
}



