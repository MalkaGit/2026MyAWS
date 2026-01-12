//9.1, 19.6
// Thin controller layer: extracts validated data from req.validated, calls service, returns HTTP response
//Flow
// -auth middleware runs first, writing user id to request context and to typed request
// -request validator runs next, validating body, params, and query
//  and writing the typed objects on the typed (authorized) request
// -the methods on this controller do not get express request (which requires casting as),
//  but gets the authenticated typed request
// - Errors handled by errorMiddleware 
// Clean
import { logger } from "@server/lib-common";
import { AuthenticatedTypedRequest } from "@server/lib-common"; //<body,params,query> with userId instead express request
import { Request, Response, NextFunction } from "express";        //not immpoting experss request
import { QueryInput } from "@server/lib-common";
import { SongCreateInput } from "./models/song.createInput";
import { SongUpdateInput } from "./models/song.updateInput";
import * as songService from "./songs.service";


/**
 * GET /songs
 * Returns a list of songs, with optional pagination, sorting, field selection, and includes.
 * Note: getAllsongs and getSongById use different schema  but in the end we use the same model (QueryInput)  
*/
export async function getAllSongs(
  req: AuthenticatedTypedRequest<any, any, QueryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId : string  = req.userId!;    //note: req.userId is string? but adding ! ensures typescipt it is string (since we are after the authMiddlware). The ! operator tells TypeScript "trust me, this value exists" - no null check needed
    //logger.info(`getAllSongs was called for  ${userId}`);
    const query :QueryInput | undefined = req.validatedQuery;   // If user sends no query string: Zod returns undefined    
    const songs = await songService.getAllSongs(query);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
}


/**
 * GET /songs/:id
 * Returns a single song by ID, with optional field selection and includes.
 * Notes:
 * - getAllsongs and getSongById use different schema  but in the end we use the same model (QueryInput)  
 
*/
export async function getSongById(
  req: AuthenticatedTypedRequest<any, { id: string }, QueryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // No 'as' needed - req.params is already typed   (req.params as {id:string})
    const query :QueryInput | undefined = req.validatedQuery;  // If user sends no query string: Zod returns undefined    
    const song = await songService.getSongById(id, query);
    res.status(200).json(song);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /songs
 * Creates a new song.
 * Notes:
 * -Assumes request validation middleware has already parsed & typed req.body as SongCreateInput.
 * -Errors → errorMiddleware (BadRequestError) 
*/
export async function createSong(
  req: AuthenticatedTypedRequest<SongCreateInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const input :SongCreateInput = req.body; // No 'as' needed - req.body is already typed as SongCreateInput
    const id = await songService.createSong(input);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}


/**
 * PATCH /songs/:id
 * Partially updates a song.
 * Assumes request validation middleware has already parsed & typed req.params and req.body.
 * Errors → errorMiddleware (NotFoundError, BadRequestError)
*/
export async function updateSong(
  req: AuthenticatedTypedRequest<SongUpdateInput, { id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // No 'as' needed - req.params is already typed   (req.params as {id:string})
    const input :SongUpdateInput = req.body; // No 'as' needed - req.body is already typed as SongUpdateInput
    await songService.updateSong(id, input);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}




/**
 * DELETE /songs/:id
 * Deletes a song by ID.
 * Assumes request validation middleware has already parsed & typed req.params.
 * Errors → errorMiddleware (NotFoundError)
*/
export async function deleteSong(
  req: AuthenticatedTypedRequest<any, { id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    
    const { id } = req.params; // No 'as' needed - req.params is already typed   (req.params as {id:string})
    await songService.deleteSong(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
