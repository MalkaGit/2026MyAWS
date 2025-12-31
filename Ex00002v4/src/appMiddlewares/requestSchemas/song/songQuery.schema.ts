//8.3
/**
 * Schema for query parameters when getting a single song
 *  - Endpoint: GET /songs/:id
 *  - Request Part: query (query string parameters)
 *  - Domain Model: SongQuery
 * 
 * Query String Format:  ?fields=title,url&include=artist
 * Parsed to: { fields: ['title', 'url'], include: ['artist'] }
 * 
* Field Validation:
 *  - fields: Optional comma-separated string, parsed to string array
 *           Allowed values: 'title', 'url', 'artistId'
 *           Note: artist_name is NOT a selectable field, returned only when include=artist
 *  - include: Optional comma-separated string, parsed to string array
 *            Allowed values: 'artist'
 * 

 * See ../readMe.txt for common validation schema information
 */

import { z } from 'zod';

// Allowed field names for field selection
// Note: artist_name is NOT a selectable field, it is returned only when include=artist
const ALLOWED_FIELDS = ['title', 'url', 'artistId'] as const;

// Allowed include values for related entities
const ALLOWED_INCLUDE = ['artist'] as const;

/**
 * Generic helper to parse comma-separated query string values into string array
 * and validate against allowed values
 * 
 * @param val - Input value (comma-separated string)
 * @param allowedValues - Array of allowed values to validate against
 * @param fieldName - Name of the field for error messages (e.g., 'fields', 'include')
 * @param removePrefix - Optional function to remove prefix before validation (e.g., remove "-" for sort fields)
 * @returns String array if valid, undefined if empty/omitted
 * @throws Error if invalid values are found
 */
function parseCommaSeparatedString(
  val: unknown,
  allowedValues: readonly string[],
  fieldName: string,
  removePrefix?: (value: string) => string
): string[] | undefined {
  if (!val || val === '') return undefined;
  
  const str = typeof val === 'string' ? val : String(val);
  const array = str.split(',').map(f => f.trim()).filter(Boolean); // filter(Boolean) removes empty strings
  
  if (array.length === 0) return undefined;
  
  // Apply prefix removal if provided (eg, rmove - for sort)
  const valuesToValidate = removePrefix 
    ? array.map(removePrefix)
    : array;
  
  // Validate all values are allowed
  const invalidValues = valuesToValidate.filter(v => !allowedValues.includes(v as any));
  if (invalidValues.length > 0) {
    throw new Error(`Invalid ${fieldName}: ${invalidValues.join(', ')}. Allowed: ${allowedValues.join(', ')}`);
  }
  
  // Return original array (with prefixes preserved if applicable)
  return array;
}

// Helper: Parse fields query parameter
const fieldsStringToFieldsArray = z.preprocess(
  (val) => parseCommaSeparatedString(val, ALLOWED_FIELDS, 'fields'),
  z.array(z.string()).optional()
);

// Helper: Parse include query parameter
const includeStringToIncludeArray = z.preprocess(
  (val) => parseCommaSeparatedString(val, ALLOWED_INCLUDE, 'includes'),
  z.array(z.string()).optional()
);




export const songQuerySchema = z
  .object({
    // Field selection: controls which fields (title/url/artistId) to return. id is always returned.
    // Format: ?fields=title,url,artistId (comma-separated list)
    fields: fieldsStringToFieldsArray,

    // Include related entities
    // Format: ?include=artist (comma-separated list)
    include: includeStringToIncludeArray,
  })
  .strict();  // ❗ throws on unknown field

