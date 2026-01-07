/**
 * Query schema for GET /:id endpoints
 *  -  Model: QueryInput (no DTO, this is domain model))
 *            note: QueryByIdInputSchema and QueryInputSchem 
 *                  both use the same mode  (with  srot,offset,limit but we ignore them for get by id
 *                  but only QueryInputSchema populates the sort,offset,limit
 * Responsibility:
 * - Parse query string values (string → number / string[])
 *      validate and returns anonymos typed object
 *      - `fields`: optional, which fields to include in response
 *      - `include`: optional, which related entities to include
 * 
* - Validate basic structure and types
 * - No business rules (those belong to service / domain validators)
 *      eg, does not validate the values of fields, include
 *  Note: when query string not provided, zod returns undefined (not object with all fields undefined)
*/

import { z } from 'zod';

export const QueryByIdInputSchema = z.object({
  fields: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value.split(",").map(v => v.trim()).filter(Boolean);
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
})
.strict() // no other fields
.transform((data) => {
  // If all fields are undefined/empty, return undefined instead of object with all undefined fields
  const hasAnyValue = data.fields?.length || data.include?.length;
  return hasAnyValue ? data : undefined;
});