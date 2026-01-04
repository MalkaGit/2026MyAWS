//8.2
/**
 * Schema for creating a new song
 *  - Endpoint: POST /songs
 *  - Request Part: body (JSON payload)
 *  - Model: SongCreateInput (no DTO, this is domain model)

 * 
 * Field Validation:
 *  - title: Required string, minimum length 1 (non-empty)
 *  - artistId: Required string, must be valid UUID format
 *  - url: Optional string, must be valid URL format when provided
 * 
 * See ../readMe.txt for common validation schema information
 */

import { z } from 'zod';

export const songCreateSchema = z
  .object({
    title: z.string().min(1),
    artistId: z.uuid(),
    url: z.url().optional(),
  })
  .strict(); // ❗ throws on unknown field

  