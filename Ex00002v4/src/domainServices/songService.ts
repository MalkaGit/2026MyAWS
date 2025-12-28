//7
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { Song } from "../domainModels/song/song";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songRepo from "../infra.repositories/songRepository";
import { BadRequestError, NotFoundError } from "../domainErrors/domainErrors";

/**
 * Get all songs, optionally with query parameters
 * note: query is optional. when not given all fields returned, and icnlude defaults to false
 */
export async function getAllSongs(query?: SongQuery): Promise<Song[]> {
  //TODO: validate query (fields, sort, paging parameters etc)
  const songs = await songRepo.getAllSongs(query);
  return songs;
}



/**
 * Get a single song by ID, optionally with query parameters
 * Throws NotFoundError if not found
 * note: query is optional. when not given all fields returned and include defaults to false
 */
export async function getSongById(id: string, query?: SongQuery): Promise<Song> {
  if (!id) throw new BadRequestError("Song ID is required");
  //TODO: validate query (fields etc)

  const song = await songRepo.getSongById(id, query);

  if (!song) throw new NotFoundError(`Song with id ${id} not found`);

  return song;
}



/**
 * Create a new song
 * returns the id of the new song
 * Throws BadRequestError if required fields are missing
 */
export async function createSong(input: SongCreateInput): Promise<string> {
  if (!input) throw new BadRequestError("Input is required");
  if (!input.title || !input.artistId) {
    throw new BadRequestError("Title and artistId are required");
  }

  // TODO: validate artist existence here using ArtistRepository
  // const artistExists = await artistRepo.exists(input.artistId);
  // if (!artistExists) throw new BadRequestError("Artist does not exist");

  const id: string =  await songRepo.createSong(input);
  return id;
}


/**
 * Update an existing song
 * Partial update supported (fields can be nullable)
 * Throws BadRequestError if input is invalid
 * Throws NotFoundError if song does not exist
 * Note: could have added throwOnNotFound :  boolean to allow calling the method for internal usage without NotFound exception
*/
export async function updateSong(id: string, input: SongUpdateInput): Promise<boolean> {
  if (!id) throw new BadRequestError("Song ID is required");
  if (!input || Object.keys(input).length === 0) {
    throw new BadRequestError("Nothing to update");
  }

  // TODO: validate artist existence if artistId is provided
  // if (input.artistId) { ... }

  const updated: boolean = await songRepo.updateSong(id, input);
  if (!updated) throw new NotFoundError(`Song with id ${id} not found`);

  return updated;
}


/**
 * Delete a song
 * Returns true if deleted, false otherwise
 * Throws NotFoundError if song does not exist
 * Note: could have added throwOnNotFound :  boolean to allow calling the method for internal usage without NotFound exception
*/
export async function deleteSong(id: string): Promise<boolean> {
  if (!id) throw new BadRequestError("Song ID is required");

  const deleted = await songRepo.deleteSong(id);
  if (!deleted) throw new NotFoundError(`Song with id ${id} not found`);
  return deleted;
}