//10.2
/**
 * HTTP request validation schema for:
 * PATCH /songs/:id
 *
 * Responsibilities:
 * - Allow partial updates (all fields optional)
 * - Reject empty request bodies
 * - Reject unknown fields
 * - Validate field formats
 *
 * Notes:
 * - HTTP boundary only
 * - Domain remains validation-library free
 */

import { z } from 'zod';

/**
 * Schema for updating a song
 */
export const songUpdateSchema = z
  .object({
    title: z.string().min(1, { message: 'required' }).optional(),
    artistId: z.string().uuid({ message: 'invalid_uuid' }).optional(),
    url: z.string().url({ message: 'invalid_url' }).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'empty_update', // ensures at least one field is provided
      path: [], // attaches error to the root
    }
  );



/*
{}
==>empty_update

unknown field 
==>unrecognized_keys

{ "artistId": "123" }
==> invalid_uuid

{ "title": "" }
==>required

*/