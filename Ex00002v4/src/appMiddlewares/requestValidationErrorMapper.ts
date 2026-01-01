//9.3
/**
 * Error middleware catch zod validation errors and maps them to bad request errors
 * To provide the frontend application detailed error code,
 * the Error middeware use this method 
 * to map Zod error to library-agnostic error codes for API consumers.
 * 
 * Error Codes (with examples):
 * 
 * - invalid_type: Wrong data type provided
 *   Example: { field: "limit", code: "invalid_type" } when limit="abc" (expected number)
 * 
 * - too_small: Value below minimum (string length, number, array size)
 *   Example: { field: "title", code: "too_small" } when title="" (min length 1)
 *   Example: { field: "limit", code: "too_small" } when limit=0 (min 1)
 * 
 * - too_big: Value above maximum (string length, number, array size)
 *   Example: { field: "limit", code: "too_big" } when limit=200 (max 100)
 * 
 * - invalid_string: Invalid string format (general)
 *   Example: { field: "url", code: "invalid_string" } when url="not-a-url"
 * 
 * - uuid: Invalid UUID format
 *   Example: { field: "id", code: "uuid" } when id="not-a-uuid"
 * 
 * - url: Invalid URL format
 *   Example: { field: "url", code: "url" } when url="invalid-url"
 * 
 * - email: Invalid email format
 *   Example: { field: "email", code: "email" } when email="not-an-email"
 * 
 * - unrecognized_keys: Extra fields not allowed (strict mode)
 *   Example: { field: "root", code: "unrecognized_keys" } when body has extra fields
 * 
 * - custom: Custom validation error from schema.refine()
 *   Example: { field: "root", code: "at_least_one_field_required" } from custom refine message
 * 
 * - invalid: Unknown/unmapped error code
 *   Example: { field: "field", code: "invalid" } for unexpected validation errors
 * 
 * Field paths: dot notation for nested (e.g., "user.address"), 'root' for root-level errors
 * Returns: Array of errors (multiple validation failures possible in single request)
 * 
 */

import { ZodError, ZodIssue } from 'zod';

export interface ValidationErrorDto {
  field: string;  // Field path (dot notation for nested, 'root' for root-level)
  code: string;   // Stable error code (library-agnostic)
}

export function mapZodErrorToDtoErrorCode(error: ZodError): ValidationErrorDto[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : 'root',
    code: mapIssueCode(issue),
  }));
}

function mapIssueCode(issue: ZodIssue): string {
  const code = issue.code as string;
  
  switch (code) {
    case 'invalid_type':
      return 'invalid_type';

    case 'too_small':
      return 'too_small';

    case 'too_big':
      return 'too_big';

    case 'invalid_string':
    case 'invalid_format':
      const validationType = (issue as any).validation;
      return validationType ?? 'invalid_string';

    case 'unrecognized_keys':
      return 'unrecognized_keys';

    case 'custom':
      // ⚠️ Schema authors must use stable error code strings in refine() messages
      // Good: 'at_least_one_field_required' | Bad: `Field ${fieldName} is required`
      return issue.message;

    default:
      return 'invalid';
  }
}

