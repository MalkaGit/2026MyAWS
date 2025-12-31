//7
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { SongsQuery } from "../domainModels/song/songsQuery";
import { Song } from "../domainModels/song/song";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";
import * as songRepo from "../infra.repositories/mySqlDB.mysql2/songRepository";
import { BadRequestError, NotFoundError } from "../domainErrors/domainErrors";

const ALLOWED_SORT_FIELDS = ['id', 'title', 'url', 'artistId', 'artist_name'];

/**
 * Validates sort fields against whitelist and ensures related entity includes are specified
 * 
 * @param sort - Optional array of field names for sorting (e.g., ['title', '-artistId']). 
 *               Prefix field with '-' for descending order. When omitted or empty, validation is skipped.
 * @param include - Optional array of related entity names to include (e.g., ['artist']). 
 *                 When omitted or empty, no related entities are included.
 * @throws BadRequestError if invalid sort fields are provided or if sorting by related entity fields without include
 */
function validateSortFields(sort?: string[], include?: string[]): void {
  if (!sort || sort.length === 0) return;

  const fields = sort.map(field => {
    return field.startsWith('-') ? field.slice(1) : field;
  });

  const invalidFields = fields.filter(field => !ALLOWED_SORT_FIELDS.includes(field));
  if (invalidFields.length > 0) {
    throw new BadRequestError(
      `Invalid sort fields: ${invalidFields.join(', ')}. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`
    );
  }

  if (fields.includes('artist_name') && !include?.includes('artist')) {
    throw new BadRequestError(
      'Sorting by artist_name requires include=artist. Please add ?include=artist to your request.'
    );
  }
}

/**
 * Get all songs with optional filtering, sorting, pagination, and field selection
 * 
 * @param query - Optional query parameters for filtering, sorting, pagination, and field selection
 * @param query.fields - Optional array of field names to return (e.g., ['title', 'url', 'artistId']). 
 *                       When omitted or empty, all fields are returned. id is always returned (industry best practice).
 * @param query.include - Optional array of related entity names to include (e.g., ['artist']). 
 *                        When omitted or empty, no related entities are included.
 * @param query.pagination - Optional pagination (limit, offset). When omitted, all items are returned. Controller will set defaults if not provided.
 * @param query.sort - Optional array of field names for sorting (e.g., ['title', '-artistId']). 
 *                     Prefix field with '-' for descending order. Fields validated against whitelist.
 *                     When omitted or empty, no sorting is applied (default order).
 * @returns Array of Song objects. Empty array if no songs found
 * @throws BadRequestError if invalid sort fields are provided or if sorting by related entity fields without include
 */
export async function getAllSongs(query?: SongsQuery): Promise<Song[]> {
  validateSortFields(query?.sort, query?.include);
  
  const songs = await songRepo.getAllSongs(query);
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
export async function getSongById(id: string, query?: SongQuery): Promise<Song> {
  const song = await songRepo.getSongById(id, query);

  if (!song) {
    throw new NotFoundError(`Song with id ${id} not found`);
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
    throw new BadRequestError("Nothing to update");
  }

  // TODO: Implement artist existence validation when ArtistRepository is available
  // This should validate artistId if provided in the update input

  const updated = await songRepo.updateSong(id, input);
  if (!updated) {
    throw new NotFoundError(`Song with id ${id} not found`);
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
    throw new NotFoundError(`Song with id ${id} not found`);
  }
  
  return deleted;
}