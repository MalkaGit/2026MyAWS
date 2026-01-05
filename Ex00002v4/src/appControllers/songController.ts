//9.1
// Thin controller layer: extracts validated data from req.validated, calls service, returns HTTP response
import { Request, Response, NextFunction } from "express";
import { QueryInput } from "../domainModels/queryInput";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songService from "../domainServices/songService";



/**
 * GET /songs
 * Returns a list of songs, with optional pagination, sorting, field selection, and includes.
 * Note: getAllsongs and getSongById use different schema  but in the end we use the same model (QueryInput)  
 */
export async function getAllSongs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Use validatedQuery if available (from validation middleware), otherwise fall back to req.query
    const query = ((req as any).validatedQuery ?? req.query) as QueryInput;
    const songs = await songService.getAllSongs(query);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
}



/**
 * GET /songs/:id
 * Returns a single song by ID, with optional field selection and includes.
 * Note: getAllsongs and getSongById use different schema  but in the end we use the same model (QueryInput)  
 * Assumes request validation middleware has already parsed & typed req.params and req.query.
 * Errors → errorMiddleware (NotFoundError) 
*/
export async function getSongById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    // Use validatedQuery if available (from validation middleware), otherwise fall back to req.query
    const query = ((req as any).validatedQuery ?? req.query) as QueryInput;
    const song = await songService.getSongById(id, query);
    res.status(200).json(song);
  } catch (err) {
    next(err);
  }
}



/**
 * POST /songs
 * Creates a new song.
 * Assumes request validation middleware has already parsed & typed req.body as SongCreateInput.
 * Errors → errorMiddleware (BadRequestError) 
*/
export async function createSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = req.body as SongCreateInput;
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
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const input = req.body as SongUpdateInput;
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
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    await songService.deleteSong(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
