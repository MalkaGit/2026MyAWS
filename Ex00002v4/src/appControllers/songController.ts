//9.1
// Thin controller layer: extracts validated data from req.validated, calls service, returns HTTP response
// Critical: using TypedRequest instead of Request that requires using as and any cast
import { TypedRequest } from "../appTypes/express";  //<body,params,query>
import { Request, Response, NextFunction } from "express";
import { QueryInput } from "../domainModels/common/queryInput";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songService from "../domainServices/songService";


/**
 * GET /songs
 * Returns a list of songs, with optional pagination, sorting, field selection, and includes.
 * Note: getAllsongs and getSongById use different schema  but in the end we use the same model (QueryInput)  
*/
export async function getAllSongs(
  req: TypedRequest<any, any, QueryInput>, //instead untyped request 
  res: Response,
  next: NextFunction
) {
  try {
    // Query string is optional (all fields in QueryInputSchema are optional)
    // If user sends no query string: Zod returns undefined (not object with all fields undefined)
    // If user sends query string: validatedQuery is a QueryInput object
    const query :QueryInput | undefined = req.validatedQuery;
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
  req: TypedRequest<any, { id: string }, QueryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // No 'as' needed - req.params is already typed   (req.params as {id:string})
    // Query string is optional (all fields in QueryByIdInputSchema are optional)
    // If user sends no query string: Zod returns undefined (not object with all fields undefined)
    // If user sends query string: validatedQuery is a QueryInput object
    const query :QueryInput | undefined = req.validatedQuery;
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
  req: TypedRequest<SongCreateInput>,
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
  req: TypedRequest<SongUpdateInput, { id: string }>,
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
  req: TypedRequest<any, { id: string }>,
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
