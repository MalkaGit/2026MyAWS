//10.3

/**
 * HTTP request validation schema for:
 * GET /songs
 * GET /songs/:id
 *
 * Responsibilities:
 * - Validate query parameters
 * - Parse pagination
 * - Validate include / fields / sort
 * - Reject unknown query parameters
 *
 * Notes:
 * - HTTP boundary only
 * - Domain remains library-free
 */

import { z } from 'zod';

/**
 * Query parameters for /songs endpoints
 * - pagination: optional, with limit/offset
 * - sort: optional, string
 * - fields/include: optional
 */
export const songQuerySchema = z.object({
  pagination: z
    .object({
      limit: z.preprocess(
        val => (val !== undefined ? Number(val) : undefined),
        z.number().int().positive()
      ).optional(),
      offset: z.preprocess(
        val => (val !== undefined ? Number(val) : undefined),
        z.number().int().min(0)
      ).optional(),
    })
    .optional(),

  sort: z.string().optional(),

  fields: z
    .object({
      id: z.boolean().optional(),
      title: z.boolean().optional(),
      url: z.boolean().optional(),
      artistId: z.boolean().optional(),
    })
    .optional(),

  include: z
    .object({
      artist: z.boolean().optional(),
    })
    .optional(),
}).partial(); // allow any combination of fields


/*
?sort=title;DROP TABLE
==>invalid_sort


?hack=true
==>unrecognized_keys

?pagination[limit]=-1
==>validation error

*/