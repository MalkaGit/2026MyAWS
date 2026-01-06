//9.2
// Song routes with validation middleware
// Flow: Request → 
// Validation Middleware (writes typed data to req or throws zod errors) 
// → Controller (reads from req.validated) 
// → Service (throws domain errors) 
// → Repository
// Error Middleware (catches  errors) 

import { Router } from 'express';
import { createRequestValidator } from '../appMiddlewares/requstValidator';
import { QueryInputSchema } from '../appRequests/shared/queryInput.schema';
import { QueryByIdInputSchema } from '../appRequests/shared/queryByIdInput.schema';
import { songCreateSchema } from '../appRequests/songCreate.schema';
import { songUpdateSchema } from '../appRequests/songUpdate.schema';
import { songParamsSchema } from '../appRequests/songParams.schema';
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
