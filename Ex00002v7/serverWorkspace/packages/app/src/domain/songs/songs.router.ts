//9.2
// Song routes with validation middleware
// Flow: Request → 
// Validation Middleware (writes typed data to req or throws zod errors) 
// → Controller (reads from req.validated) 
// → Service (throws domain errors) 
// → Repositor
// Error Middleware (catches  errors) 

import { Router } from 'express';
import { createRequestValidator, QueryInputSchema, QueryByIdInputSchema } from "@server/lib-common";
import { songCreateSchema } from "./models/song.createInput.schema";
import { songUpdateSchema } from "./models/song.updateInput.schema";
import { songParamsSchema } from "./models/song.params.schema";
import * as songController from "./songs.controller";

const songRouter = Router();

/**
 * POST /songs
 */
songRouter.post(
  '/',
  createRequestValidator({ body: songCreateSchema }),
  songController.createSong
);

/**
 * GET /songs
 * Query: pagination (limit, offset), sorting, fields, include (optional)
 * when query string not provided, zod returs undefied
 */
songRouter.get(
  '/',
  createRequestValidator({ 
    query: QueryInputSchema 
  }),
  songController.getAllSongs
);

/**
 * GET /songs/:id
 * Query: fields, include (optional)
 * when query string not provided, zod returs undefined
 */
songRouter.get(
  '/:id',
  createRequestValidator({
    params: songParamsSchema,
    query: QueryByIdInputSchema,
  }),
  songController.getSongById
);

/**
 * PATCH /songs/:id
 */
songRouter.patch(
  '/:id',
  createRequestValidator({
    params: songParamsSchema,
    body: songUpdateSchema,
  }),
  songController.updateSong
);

/**
 * DELETE /songs/:id
 */
songRouter.delete(
  '/:id',
  createRequestValidator({ params: songParamsSchema }),
  songController.deleteSong
);

export default songRouter;
