
//10.7 song request route rwith the request validation middleware
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
import { createRequestValidator } from '../appMiddlewares/requstValidatorMiddelware';

// Zod schemas
import { songCreateSchema } from '../appMiddlewares/requestSchemas/song/songCreate.schema';
import { songUpdateSchema } from '../appMiddlewares/requestSchemas/song/songUpdate.schema';
import { songQuerySchema } from '../appMiddlewares/requestSchemas/song/songQuery.schema';
import { songParamsSchema } from '../appMiddlewares/requestSchemas/song/songParams.schema';

import * as songController from '../appControllers/songController';

const songRouter = Router();

/**
 * POST /songs
 * Example:
 *     POST /api/songs
       Content-Type: application/json
      {
          "title":    "My Song",
          "artistId": "88939d74-dffd-11f0-87a2-0afd50b0f46d",
          "url":      "https://mysong.com/song.mp3"
      }
      in express:
        req.body = {
          title:    "My Song",
          artistId: "88939d74-dffd-11f0-87a2-0afd50b0f46d",
          url:      "https://mysong.com/song.mp3"
        };
 */
songRouter.post(
  '/',
  createRequestValidator({      //calling createRequestValidator and passing it schema to validate 
    body: songCreateSchema 
  }),
  songController.createSong
);




/**
 * GET /songs
 * Query params: pagination, sorting, fields, include
 * Example: GET /api/songs?limit=10&offset=20&sort=-title
  
            in epress 
            req.query = {
                limit: "10",    // note: strings by default
                offset: "20",
                sort: "-title"
            };

            You often use z.preprocess() to convert string → number for pagination:
            limit: z.preprocess(Number, z.number().int().positive()).optional()
 */
songRouter.get(
  '/',
  createRequestValidator({
     query: songQuerySchema 
  }),
  songController.getAllSongs
);


/**
 * GET /songs/:id
   Example:       GET /songs/39606de9-131e-4fcb-955d-c9a942fa46ea?limit=10&offset=20&sort=-title
  
            in epress: 
            req.query = {
                limit: "10",    // note: strings by default
                offset: "20",
                sort: "-title"
            };

            You often use z.preprocess() to convert string → number for pagination:
            limit: z.preprocess(Number, z.number().int().positive()).optional()


      in express:
             req.params = {
                    id: "39606de9-131e-4fcb-955d-c9a942fa46d"
                  }
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
 * Example:
      PATCH /api/songs/88939d74-dffd-11f0-87a2-0afd50b0f46d
       Content-Type: application/json
      {
          "title":    "My Song",
          "artistId": "88939d74-dffd-11f0-87a2-0afd50b0f46d",
          "url":      "https://mysong.com/song.mp3"
      }
      in express:
        req.params = {
                    id: "88939d74-dffd-11f0-87a2-0afd50b0f46d"
                  }
        req.body = {
          title:    "My Song",
          artistId: "88939d74-dffd-11f0-87a2-0afd50b0f46d",
          url:      "https://mysong.com/song.mp3"
        };
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
 * Example:
      DELETE /api/songs/88939d74-dffd-11f0-87a2-0afd50b0f46d
      
      in express:
        req.params = {
                    id: "88939d74-dffd-11f0-87a2-0afd50b0f46d"
                  }
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