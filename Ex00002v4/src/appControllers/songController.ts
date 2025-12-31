//9.1
// Express controller - thin layer that extracts validated request data and calls service
import { Request, Response, NextFunction } from "express";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { SongsQuery } from "../domainModels/song/songsQuery";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songService from "../domainServices/songService";

/**
 * GET /songs
 * Service throws NotFoundError/BadRequestError which are handled by error middleware (next(err))
 */
export async function getAllSongs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // req.query validated by middleware, but TypeScript doesn't know - safe to cast
    const query: SongsQuery = mapSongsQuery(req);
    const songs = await songService.getAllSongs(query);
    res.status(200).json(songs);
  } catch (err) {
    next(err); // Pass to error middleware (handles NotFoundError, BadRequestError, etc.)
  }
}

/**
 * GET /songs/:id
 * Service throws NotFoundError if song not found (handled by error middleware)
 */
export async function getSongById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // Validated as UUID by middleware
    // req.query validated by middleware, but TypeScript doesn't know - safe to cast
    const query: SongQuery = mapSongQuery(req);
    const song = await songService.getSongById(id, query);
    res.status(200).json(song);
  } catch (err) {
    next(err); // Pass to error middleware
  }
}

/**
 * POST /songs
 */
export async function createSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // req.body validated by middleware - structure guaranteed valid
    const input: SongCreateInput = req.body;
    const id = await songService.createSong(input);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /songs/:id
 * Service throws NotFoundError if song not found, BadRequestError if validation fails
 */
export async function updateSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // Validated as UUID by middleware
    // req.body validated by middleware - structure guaranteed valid
    const input: SongUpdateInput = req.body;
    await songService.updateSong(id, input);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /songs/:id
 * Service throws NotFoundError if song not found (handled by error middleware)
 */
export async function deleteSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params; // Validated as UUID by middleware
    await songService.deleteSong(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * Maps validated req.query to SongsQuery type.
 * Note: req.query is validated by middleware, but TypeScript types don't reflect this.
 * Type assertions are safe because validation middleware guarantees structure.
 */
function mapSongsQuery(req: Request): SongsQuery {
  return {
    include: (req.query.include as string[]) || undefined,
    fields: (req.query.fields as SongsQuery['fields']) || undefined,
    // Schema preprocesses strings to numbers, but TypeScript still sees strings
    pagination: req.query.limit
      ? {
          limit: Number(req.query.limit),
          offset: Number(req.query.offset ?? 0),
        }
      : undefined,
    sort: (req.query.sort as string[]) || undefined,
  };
}

/**
 * Maps validated req.query to SongQuery type.
 * Note: req.query is validated by middleware, but TypeScript types don't reflect this.
 * Type assertions are safe because validation middleware guarantees structure.
 */
function mapSongQuery(req: Request): SongQuery {
  return {
    include: (req.query.include as string[]) || undefined,
    fields: (req.query.fields as SongQuery['fields']) || undefined,
  };
}
