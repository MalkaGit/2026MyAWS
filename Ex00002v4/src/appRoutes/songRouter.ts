//9.2
// Song routes with validation middleware
// Flow: Request → 
// Validation Middleware (writes to req.validated or throws zod errors) 
// → Controller (reads from req.validated) 
// → Service (throws domain errors) 
// → Repository
// Error Middleware (catches  errors) 

import { Router } from 'express';
import { createRequestValidator } from '../appMiddlewares/requstValidatorMiddelware';
import { songCreateSchema } from '../appMiddlewares/requestSchemas/song/songCreate.schema';
import { songUpdateSchema } from '../appMiddlewares/requestSchemas/song/songUpdate.schema';
import { songQuerySchema } from '../appMiddlewares/requestSchemas/song/songQuery.schema';
import { songsQuerySchema } from '../appMiddlewares/requestSchemas/song/songsQuery.schema';
import { songParamsSchema } from '../appMiddlewares/requestSchemas/song/songParams.schema';
import * as songController from '../appControllers/songController';

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
 */
songRouter.get(
  '/',
  createRequestValidator({ 
    query: songsQuerySchema.optional() 
  }),
  songController.getAllSongs
);

/**
 * GET /songs/:id
 * Query: fields, include (optional)
 */
songRouter.get(
  '/:id',
  createRequestValidator({
    params: songParamsSchema,
    query: songQuerySchema.optional(),
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
