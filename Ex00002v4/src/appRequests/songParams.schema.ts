//8.3
/**
 * Schema for validating URL path parameters
 *  - Endpoints: GET /songs/:id, PATCH /songs/:id, DELETE /songs/:id
 *  - Request Part: params (URL path parameters)
 *  - Model: { id: string } (no DTO, this is domain model))
 * 
 * Field Validation:
 *  - id: Required string, must be valid UUID format
 * 
 * See ../readMe.txt for common validation schema information
 */

import { z } from 'zod';

export const songParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict(); // ❗ throws on unknown field
