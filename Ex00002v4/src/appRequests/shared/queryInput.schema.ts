/**
 * QueryInput request schema
 *  *  - Endpoint: Get /songs
 *  -  Model: QueryInput (no DTO, this is domain model))
 *  - Note:
 *    - when query string not provided, zod returns undefined (not object with all fields undefined) 
 * 
 * Responsibility:
 * - Parse query string values (string → number / string[])
 *      validate and returns anonymos typed object
 * - Validate basic structure and types
 * - No business rules (those belong to service / domain validators)
 *      eg, does not validate the values of fields, sort, include
*/

import { z } from "zod";

export const QueryInputSchema = z.object({
  /**
   * Fields selection
   * Example:
   *   ?fields=title,url
   */
  fields: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value.split(",").map(v => v.trim()).filter(Boolean);   //Boolean - removes empty strings
        }
        if (Array.isArray(value)) {
          // Express already parsed it as an array (e.g., ?fields[]=title&fields[]=url)
          return value.map(v => String(v).trim()).filter(Boolean);
        }
        // undefined or other types - pass through (undefined handled by .optional(), others will fail validation)
        return value;
      },
      z.array(z.string()).optional()
    ),

  /**
   * Include related entities
   * Example:
   *   ?include=artist
   */
  include: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value.split(",").map(v => v.trim()).filter(Boolean);
        }
        if (Array.isArray(value)) {
          // Express already parsed it as an array
          return value.map(v => String(v).trim()).filter(Boolean);
        }
        return value;
      },
      z.array(z.string()).optional()
    ),

  /**
   * Sorting
   * Example:
   *   ?sort=title,-artistId
   */
  sort: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value.split(",").map(v => v.trim()).filter(Boolean);
        }
        if (Array.isArray(value)) {
          // Express already parsed it as an array
          return value.map(v => String(v).trim()).filter(Boolean);
        }
        return value;
      },
      z.array(z.string()).optional()
    ),

  /**
   * Pagination
   * Example:
   *   ?limit=20&offset=0
   */
  limit: z
    .preprocess(
      (value) => (value !== undefined ? Number(value) : undefined),
      z.number().int().positive().optional()
    ),

  offset: z
    .preprocess(
      (value) => (value !== undefined ? Number(value) : undefined),
      z.number().int().min(0).optional()
    ),
})
.strict() //no other fields
.transform((data) => {
  // If all fields are undefined/empty, return undefined instead of object with all undefined fields
  const hasAnyValue = data.fields?.length || data.include?.length || data.sort?.length || 
                      data.limit !== undefined || data.offset !== undefined;
  return hasAnyValue ? data : undefined;
});


/**
 * Type inferred from schema
 * (Request-level DTO)
 */
//export type QueryInputDTO = z.infer<typeof QueryInputSchema>;

























/*
older - wrong 
-mapping and changing structure


//8.4

 * Schema for query parameters when getting all songs
 *  - Endpoint: GET /songs
 *  - Request Part: query (query string parameters)
 *  - Domain Model: SongsQuery
 * 
 *  Query String Format:
 *  - ?limit=10&offset=20&sort=-title,artistId&fields=title,url&include=artist
 *  - Parsed to: { limit: 10, offset: 20, sort: ['-title', 'artistId'], fields: ['title', 'url'], include: ['artist'] }
 * 
 * Field Validation:
 *  - fields: Optional comma-separated string, parsed to string array
 *           Allowed values: 'title', 'url', 'artistId'
 *           Note: artist_name is NOT a selectable field, returned only when include=artist
 *  - include: Optional comma-separated string, parsed to string array
 *            Allowed values: 'artist'
 *  - limit: Optional number, integer, positive, max 100
 *  - offset: Optional number, integer, minimum 0
 *  - sort: Optional comma-separated string, parsed to string array
 *         Allowed values: 'id', 'title', 'url', 'artistId', 'artist_name'
 *         Prefix with '-' for descending order (e.g., '-title')
 *         Note: artist_name requires include=artist (validated in service layer)
 * 
 
 * See ../readMe.txt for common validation schema information
 

import { z } from 'zod';

// Allowed field names for field selection
// Note: artist_name is NOT a selectable field, it is returned only when include=artist
const ALLOWED_FIELDS = ['title', 'url', 'artistId'] as const;

// Allowed include values for related entities
const ALLOWED_INCLUDE = ['artist'] as const;

// Allowed sort field names
// Note: artist_name requires include=artist (validated in service layer)
const ALLOWED_SORT_FIELDS = ['id', 'title', 'url', 'artistId', 'artist_name'] as const;


 * Generic helper to parse comma-separated query string values into string array
 * and validate against allowed values
 * 
 * @param val - Input value (string or other, will be converted to string)
 * @param allowedValues - Array of allowed values to validate against
 * @param fieldName - Name of the field for error messages (e.g., 'fields', 'include', 'sort fields')
 * @param removePrefix - Optional function to remove prefix before validation (e.g., remove "-" for sort fields)
 * @returns String array if valid, undefined if empty/omitted
 * @throws Error if invalid values are found
 
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
  
  // Apply prefix removal if provided (for sort fields with "-" prefix)
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

// Helper: Parse sort query parameter (removes "-" prefix for validation, preserves in output)
const sortStringToSortArray = z.preprocess(
  (val) => parseCommaSeparatedString(
    val,  ALLOWED_SORT_FIELDS, 'sort fields',
    (field) => field.startsWith('-') ? field.slice(1) : field
  ),
  z.array(z.string()).optional()
);

export const songsQuerySchema = z
  .object({
    // Field selection: controls which fields (title/url/artistId) to return. id is always returned.
    // Format: ?fields=title,url,artistId (comma-separated list)
    fields: fieldsStringToFieldsArray,

    // Include related entities
    // Format: ?include=artist (comma-separated list)
    include: includeStringToIncludeArray,

    // Pagination: limit and offset for result pagination
    limit: z
      .preprocess(Number, z.number().int().positive().max(100))
      .optional(),

    offset: z
      .preprocess(Number, z.number().int().min(0))
      .optional(),

    // Sort: controls sorting order
    // Format: ?sort=title,-artistId (comma-separated list, prefix with "-" for descending)
    sort: sortStringToSortArray,
  })
  .strict()
  //using transform since limit and offset in  domain object under pagination object
  .transform((data) => {
    // Transform limit and offset from top-level to pagination object (matches SongsQuery domain model)
    const { limit, offset, ...rest } = data;
    return {
      ...rest,
      ...(limit !== undefined
        ? {
            pagination: {
              limit,
              offset: offset ?? 0,
            },
          }
        : {}),
    };
  });

*/