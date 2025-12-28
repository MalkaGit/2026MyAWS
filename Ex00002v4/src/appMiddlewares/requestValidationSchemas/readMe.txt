Zod schema

1. Clean
    Zod schema arer cloud agnostic 
    Zod schema are fw agnotsict (express, next fastify)
    Zod schena are tied to library (zod)

2. How to test
import { songCreateSchema } from './songCreate.schema';

try {
  songCreateSchema.parse({
    body: {
      title: "",
      artistId: "123"
    }
  });
} catch (e) {
  console.error(e.errors);
}
