//10.1
import { z } from 'zod';

/**
 * HTTP request validation schema for:
 * POST /songs
 *
 * Responsibilities:
 * - Validate request shape and types
 * - Reject unknown fields (security)
 * - Provide stable, machine-readable error reasons
 *
 * Notes:
 * - Used ONLY at HTTP boundary
 * - Domain layer remains library-free
 */

export const songCreateSchema = z.object({
  title: z.string().min(1, { message: 'required' }),
  artistId: z.uuid({ message: 'invalid_uuid' }),
  url: z.url({ message: 'invalid_url' }).optional(),
});




/*
{
  "title": "",
  "artistId": "550e8400-e29b-41d4-a716-446655440000"
}

{
  "code": "REQUEST_VALIDATION_FAILED",
  "errors": [
    { "field": "title", "type": "required" }
  ]
}




{
  "title": "Song",
  "artistId": "550e8400-e29b-41d4-a716-446655440000",
  "hack": true
}
{
  "code": "REQUEST_VALIDATION_FAILED",
  "errors": [
    { "field": "_request", "type": "unknown_field" }
  ]
}



{
  "title": "Song",
  "artistId": "123"
}
{
  "code": "REQUEST_VALIDATION_FAILED",
  "errors": [
    { "field": "artistId", "type": "invalid_uuid" }
  ]
}

*/