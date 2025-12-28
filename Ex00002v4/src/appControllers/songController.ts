//8.2
//  Express controller
import { Request, Response, NextFunction } from "express";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { Song } from "../domainModels/song/song";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songService from "../domainServices/songService";


/**
 * GET /songs
 */
export async function getAllSongs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query: SongQuery = mapSongQuery(req);         //the query
    const songs = await songService.getAllSongs(query);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /songs/:id
 */
export async function getSongById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;                        //the id
    const query: SongQuery = mapSongQuery(req);       //the query
    const song = await songService.getSongById(id, query);
    res.status(200).json(song);
  } catch (err) {
    next(err);
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
    const input: SongCreateInput = req.body;            //the body
    const id = await songService.createSong(input);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /songs/:id
 */
export async function updateSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;                    //the id
    const input: SongUpdateInput = req.body;      //the body
    await songService.updateSong(id, input);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /songs/:id
 */
export async function deleteSong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;                //the id
    await songService.deleteSong(id);         
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}



function mapSongQuery(req: Request): SongQuery {
    return {
      include: {
        artist: req.query.include === "artist",
      },
      fields: req.query.fields
        ? Object.fromEntries(
            (req.query.fields as string).split(",").map(f => [f, true])
          )
        : undefined,
      pagination: req.query.limit
        ? {
            limit: Number(req.query.limit),
            offset: Number(req.query.offset ?? 0),
          }
        : undefined,
      sort: req.query.sort as string | undefined,
    };
  }
  