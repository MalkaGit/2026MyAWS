//9.1
// Thin controller layer: extracts validated data from req.validated, calls service, returns HTTP response
import { Request, Response, NextFunction } from "express";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { SongsQuery } from "../domainModels/song/songsQuery";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songService from "../domainServices/songService";

/**
 * GET /songs
 * Errors → errorMiddleware (BadRequestError, NotFoundError)
 */
export async function getAllSongs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query: SongsQuery | undefined = req.validated?.query as SongsQuery | undefined;
    const songs = await songService.getAllSongs(query);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /songs/:id
 * Errors → errorMiddleware (NotFoundError)
 */
export async function getSongById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.validated!.params as { id: string };
    const query: SongQuery | undefined = req.validated?.query as SongQuery | undefined;
    const song = await songService.getSongById(id, query);
    res.status(200).json(song);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /songs
 * Errors → errorMiddleware (BadRequestError)
 */
export async function createSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input: SongCreateInput = req.validated!.body as SongCreateInput;
    const id = await songService.createSong(input);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /songs/:id
 * Errors → errorMiddleware (NotFoundError, BadRequestError)
 */
export async function updateSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.validated!.params as { id: string };
    const input: SongUpdateInput = req.validated!.body as SongUpdateInput;
    await songService.updateSong(id, input);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /songs/:id
 * Errors → errorMiddleware (NotFoundError)
 */
export async function deleteSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.validated!.params as { id: string };
    await songService.deleteSong(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

