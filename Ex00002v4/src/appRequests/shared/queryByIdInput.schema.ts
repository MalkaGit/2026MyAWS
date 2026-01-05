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
 */

import { z } from 'zod';

export const QueryByIdInputSchema = z.object({
  fields: z
    .preprocess(
      (value) =>
        typeof value === "string"
          ? value.split(",").map(v => v.trim()).filter(Boolean)
          : value,
      z.array(z.string()).optional()
    ),

  include: z
    .preprocess(
      (value) =>
        typeof value === "string"
          ? value.split(",").map(v => v.trim()).filter(Boolean)
          : value,
      z.array(z.string()).optional()
    ),
})
.strict(); // no other fields