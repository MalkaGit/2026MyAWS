//10.6 song request route rwith the request validation middleware
/*
Goal:
    wire
        Router paths (/songs, /songs/:id, etc.)
        Request validation middleware (Zod schemas for body, query, params)
        Controller methods (getAllSongs, getSongById, createSong, etc.)
Flow:
        router get requst
        router create validator
        router calls validation middleware
            passing it the request 
            passing it the schema 
            passing it the next (controller method)
        validation middleware
            validates the request against the schema  
            if request is not valid, middleware returns 400 bad requst (using the error form schema)
            if request is valid,     middlewarer pass rerquest to controller
            on other wrror,          middleware pass request to (global) error mmiddlewarer
 
Clean:
    
*/

// src/app/routers/song.routes.ts
import { Router } from 'express';
import { createRequestValidator } from '../appMiddlewares/requestValidationMiddleware';

// Zod schemas
import { songCreateSchema } from '../appMiddlewares/requestValidationSchemas/song/songCreate.schema';
import { songUpdateSchema } from '../appMiddlewares/requestValidationSchemas/song/songUpdate.schema';
import { songQuerySchema } from '../appMiddlewares/requestValidationSchemas/song/songQuery.schema';
import { songParamsSchema } from '../appMiddlewares/requestValidationSchemas/song/songParams.schema';

import * as songController from '../appControllers/songController';

const songRouter = Router();

/**
 * GET /songs
 * Query params: pagination, sorting, fields, include
 */
songRouter.get(
  '/',
  createRequestValidator({ query: songQuerySchema }),
  songController.getAllSongs
);

/**
 * GET /songs/:id
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
 * POST /songs
 */
songRouter.post(
  '/',
  createRequestValidator({ 
    body: songCreateSchema 
  }),
  songController.createSong
);

/**
 * PATCH /songs/:id
 */
songRouter.patch(
  '/:id',
  createRequestValidator({
    body: songUpdateSchema,
    params: songParamsSchema,
  }),
  songController.updateSong
);

/**
 * DELETE /songs/:id
 */
songRouter.delete(
  '/:id',
  createRequestValidator({ 
    params: songParamsSchema 
  }),
  songController.deleteSong
);

export default songRouter;

/*
//8.3 soung router without the request validation middleware
// routes/songRouter.ts
import { Router } from "express";
import * as songController from "../appControllers/songController";

const songRouter = Router();

songRouter.get("/",       songController.getAllSongs);
songRouter.get("/:id",    songController.getSongById);
songRouter.post("/",      songController.createSong);
songRouter.patch("/:id",  songController.updateSong);
songRouter.delete("/:id", songController.deleteSong);

export default songRouter;

*/