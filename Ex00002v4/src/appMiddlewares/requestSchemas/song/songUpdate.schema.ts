//10.3
/**
 * Schema for updating an existing song
 *  - Endpoint: PATCH /songs/:id
 *  - Request Part: body (JSON payload)
 *  - Domain Model: SongUpdateInput
 * 
 * Field Validation:
 *  - title: Optional string, minimum length 1 when provided
 *  - artistId: Optional string, must be valid UUID format when provided
 *  - url: Optional string | null, must be valid URL format when provided as string
 *         Supports three states: undefined (don't update), null (clear URL), string (update URL)
 * 
 * Special Validation:
 *  - At least one field must be provided (validated via .refine())
 *  - Also validated in service layer for domain consistency
 * 
 * See ../readMe.txt for common validation schema information
 */

import { z } from 'zod';

export const songUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    artistId: z.uuid().optional(),
    url: z.url().nullish(),  // Allows null, undefined, or valid URL string
  })
  .strict() // ❌ no extra fields
  .refine(
    //validates that at least one field is updated (also validated in service layer for domain consistency)
    (data) => Object.keys(data).length > 0,
    {
      message: 'at_least_one_field_required',
    }
  );
