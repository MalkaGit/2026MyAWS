//10.4
/**
 * HTTP request validation schema for:
 * GET /songs/:id
 * PATCH /songs/:id
 * DELETE /songs/:id
 *
 * Responsibilities:
 * - Validate path parameter `id`
 * - Must be a UUID
 * - Reject unknown path parameters (strict)
 *
 * Notes:
 * - HTTP boundary only
 * - Domain layer remains library-free
 */
import { z } from 'zod';

export const songParamsSchema = z.object({
  id: z.uuid({ message: 'invalid_uuid' }),
});


/*
/songs/123
==>/songs/123


*/