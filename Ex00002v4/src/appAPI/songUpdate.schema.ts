//8.4
/**
 * Schema for updating an existing song
 *  - Endpoint: PATCH /songs/:id
 *  - Request Part: body (JSON payload)
 *  - Model: SongUpdateInput (no DTO, this is domain model))
 * 
 * Field Validation:
 *  - title: Optional string, minimum length 1 when provided
 *  - artistId: Optional string, must be valid UUID format when provided
 *  - url: Optional string | null, must be valid URL format when provided as string
 *         Supports three states: undefined (don't update), null (clear URL), string (update URL)
 * 
 * Special Validation (in domai layer)
 *  - At least one field must be provided (validated via .refine())
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
  .strict(); // ❌ no extra fields
  