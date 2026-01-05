//7
//Goal:
// 1. apply defaults to the query input
// 2. validate the query input
// 3. call the repository 

//Clean
// 1. Constants at top for allowed fields, sort fields, and includes — easy to maintain for other entities.
// 2. using reusable validator for the query input 
// 3. controller handles defaults (offset/limit), 

import { QueryInputValidator, FieldDependencyMap } from "./shared/QueryInputValidator";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { Song } from "../domainModels/song/song";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import { QueryInput } from "../domainModels/queryInput";
import { BadRequestError, NotFoundError, DomainErrorCode } from "../domainErrors/domainErrors";
import * as songRepo from "../infra.repositories/mySqlDB.mysql2/songRepository";

// --- Allowed constants ---
const ALLOWED_FIELDS = ['id', 'title', 'url', 'artistId', 'artistName'];
const ALLOWED_SORT_FIELDS = ['id', 'title', 'url', 'artistId', 'artistName'];
const ALLOWED_INCLUDES = ['artist'];
const FIELD_INCLUDE_DEPENDENCIES: FieldDependencyMap = {
  artistName: ['artist'], // selecting or sorting by artistName requires include=artist
};
const DEFFAULT_LIMIT : number = 20;
const DEFFAULT_OFFSET : number = 0;
const DEFFAULT_SORT : string[] = ['id'];

/**
 * Get all songs with optional filtering, sorting, pagination, and field selection
 * 
 * @param query - Optional query parameters for filtering, sorting, pagination, and field selection
 * @param query.fields - Optional array of field names to return (e.g., ['title', 'url', 'artistId']). 
 *                       When omitted or empty, all fields are returned. id is always returned (industry best practice).
 * @param query.include - Optional array of related entity names to include (e.g., ['artist']). 
 *                        When omitted or empty, no related entities are included.
 * @param query.offset - Optional pagination (limit, offset). When omitted, all items are returned. Controller will set defaults if not provided.
 * @param query.limit - Optional pagination (limit, offset). When omitted, all items are returned. Controller will set defaults if not provided.
* @param query.sort - Optional array of field names for sorting (e.g., ['title', '-artistId']). 
 *                     Prefix field with '-' for descending order. Fields validated against whitelist.
 *                     When omitted or empty, no sorting is applied (default order).
 * @returns Array of Song objects. Empty array if no songs found
 * @throws BadRequestError if invalid sort fields are provided or if sorting by related entity fields without include
 */
export async function getAllSongs(query?: QueryInput): Promise<Song[]> {
  //refine the query input
  const refinedQuery: QueryInput = {
    ...(query ?? {}),
    limit: query?.limit ?? DEFFAULT_LIMIT,
    offset: query?.offset ?? DEFFAULT_OFFSET,
    sort: query?.sort?.length ? query.sort : DEFFAULT_SORT,
  };

  // Validate query input: fields, sort, include
  QueryInputValidator.validate(refinedQuery,
    ALLOWED_FIELDS,ALLOWED_SORT_FIELDS,ALLOWED_INCLUDES,FIELD_INCLUDE_DEPENDENCIES
  );

  const songs = await songRepo.getAllSongs(refinedQuery);
  return songs;
}



/**
 * Get a single song by ID with optional field selection and expansion
 * 
 * @param id - Song ID (UUID). Structural validation (format, required) is handled by request validation middleware.
 *             Non-HTTP callers must validate input before calling this method.
 * @param query - Optional query parameters for field selection and expansion
 * @param query.fields - Optional array of field names to return (e.g., ['title', 'url', 'artistId']). 
 *                       When omitted or empty, all fields are returned. id is always returned (industry best practice).
 * @param query.include - Optional array of related entity names to include (e.g., ['artist']). 
 *                        When omitted or empty, no related entities are included.
 * @returns Song entity
 * @throws NotFoundError if song is not found
 */
export async function getSongById(id: string, query?: QueryInput): Promise<Song> {
  QueryInputValidator.validate( query,
    ALLOWED_FIELDS,ALLOWED_SORT_FIELDS,ALLOWED_INCLUDES,FIELD_INCLUDE_DEPENDENCIES);

  const song = await songRepo.getSongById(id, query);
  if (!song) {
    throw new NotFoundError(DomainErrorCode.SONG_NOT_EXIST, `Song with id ${id} not found`);
  }

  return song;
}



/**
 * Create a new song
 * 
 * Note: Structural validation (required fields, empty strings, UUID format) is handled by 
 * request validation middleware. This method focuses on business rule validation only.
 * 
 * @param input - Song creation input with required and optional fields
 * @param input.title - Song title (required)
 * @param input.artistId - Artist ID (required, UUID)
 * @param input.url - Song URL (optional)
 * @returns The generated UUID of the newly created song
 * @throws BadRequestError if business rules are violated (e.g., artist does not exist)
 * 
 * @example
 * const songId = await createSong({
 *   title: "My Song",
 *   artistId: "artist-uuid",
 *   url: "https://example.com/song.mp3"
 * });
 */
export async function createSong(input: SongCreateInput): Promise<string> {
  // TODO: Implement artist existence validation when ArtistRepository is available
  // This is a critical business rule that should be enforced to maintain referential integrity

  const id = await songRepo.createSong(input);
  return id;
}


/**
 * Update an existing song with partial update support
 * Only updates fields that are provided (not undefined). Fields not provided remain unchanged.
 * 
 * @param id - Song ID (UUID). Structural validation (format, required) is handled by request validation middleware.
 *             Non-HTTP callers must validate input before calling this method.
 * @param input - Partial update input. All fields are optional. At least one field must be provided.
 * @param input.title - Song title (optional, only updates if provided)
 * @param input.artistId - Artist ID (optional, only updates if provided)
 * @param input.url - Song URL (optional, only updates if provided)
 * @returns true if song was updated successfully
 * @throws BadRequestError if no fields to update or business rules violated
 * @throws NotFoundError if song does not exist
 * 
 * @example
 * const updated = await updateSong("song-id", { title: "New Title" });
 */
export async function updateSong(id: string, input: SongUpdateInput): Promise<boolean> {
  if (!input || Object.keys(input).length === 0) {
    throw new BadRequestError(DomainErrorCode.PARTIAL_UPDATE_WITHOUT_FIELDS, "Nothing to update");
  }

  // TODO: Implement artist existence validation when ArtistRepository is available
  // This should validate artistId if provided in the update input

  const updated = await songRepo.updateSong(id, input);
  if (!updated) {
    throw new NotFoundError(DomainErrorCode.SONG_NOT_EXIST, `Song with id ${id} not found`);
  }

  return updated;
}


/**
 * Delete a song by ID
 * 
 * @param id - Song ID (UUID). Structural validation (format, required) is handled by request validation middleware.
 *             Non-HTTP callers must validate input before calling this method.
 * @returns true if song was deleted successfully
 * @throws NotFoundError if song does not exist
 * 
 * @example
 * const deleted = await deleteSong("song-id");
 */
export async function deleteSong(id: string): Promise<boolean> {
  const deleted = await songRepo.deleteSong(id);
  if (!deleted) {
    throw new NotFoundError(DomainErrorCode.SONG_NOT_EXIST, `Song with id ${id} not found`);
  }
  
  return deleted;
}