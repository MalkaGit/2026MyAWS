//5.1
//Goal:
//Flow:
//Clean:
//best practices:
// No HTTP concepts
// No ORM leakage
// Domain-level field names (fields, select,include)
//    mapRow maps DB fields to domain model.
// Partial updates
// id always selected
//  buildSelectFields handles fields array and always selects id
// Flat QueryInput usage (offset, limit)
// includeArtist flag
// buildSelectFields

import { ResultSetHeader } from "mysql2/promise";
import { randomUUID } from "crypto";
//import {logger} from "../../infra.utils/logger";
import { pool } from "@server/lib-common";
import { QueryInput } from "@server/lib-common"; //note: you us build lib-common
import { SongCreateInput } from "./models/song.createInput";
import { Song } from "./models/song";
import { SongUpdateInput } from "./models/song.updateInput";

//import { SongQuery } from "../../domainModels/song/songQuery";
//import { SongsQuery } from "../../domainModels/song/songsQuery";


/**
 * Helper: Maps DB row to domain Song
 * Note: id is always present since we always select it (industry best practice)
 */
function mapRow(row: any, includeArtist: boolean = true): Song {
  const song: Song = {
    id: row.id,                     // always selected
    title: row.title,              // undefined when not selected, string when selected (string title)   
    artistId: row.artist_id,       // undefined when not selected, string when selected (string id)   
    url: row.url,                  // undefined when not selected, null when explicitly null in DB
  };

  if (includeArtist && row.artist_id) {
    song.artist = {
      id: row.artist_id,
      name: row.artist_name,
    };
  }

  return song;
}

/**
 * Helper: Build SELECT fields
 * Returns all fields when input not given or empty
 * Returns joined artist fields if should includeArtist
 * 
 * Industry best practice: Uses string array for field selection, enabling generic repository pattern
 */
function buildSelectFields(
  fields?: string[],
  includeArtist = false
): string {
  const selectFields: string[] = [];

  // id is always selected (industry best practice)
  selectFields.push("s.id");
  
  // If no fields specified, select all fields
  const selectAll = !fields || fields.length === 0;
  
  if (selectAll || fields.includes('title')) {
    selectFields.push("s.title");
  }
  
  if (selectAll || fields.includes('url')) {
    selectFields.push("s.url");
  }
  
  // artist_id is needed if explicitly selected OR if including artist info
  if (selectAll || fields.includes('artistId') || includeArtist) {
    selectFields.push("s.artist_id");
  }

  //artist_name is selected  only if includeArtist is true (it is not selecteable feild !!!)
  if (includeArtist) {
    selectFields.push("a.name AS artist_name");
  }

  return selectFields.join(", ");
}


/**
 * Get all songs with optional filtering, sorting, pagination, and field selection
 * 
 * @param query - Optional query parameters for filtering, sorting, pagination, and field selection
 * @param query.fields - Optional field selection (title, url, artistId). id is always returned
 * @param query.include - Optional expansion options (e.g., artist information)
 * @param query.offset - Optional pagination (limit, offset). When omitted, all items are returned. Default values are set by controller
 * @param query.limit - Optional pagination (limit, offset). When omitted, all items are returned. Default values are set by controller
 * @param query.sort - Optional sorting array (e.g., ["title", "-artistId"]). Fields validated in service layer
 * @returns Array of Song objects. Empty array if no songs found
 * @throws Database errors may be thrown (handled by error middleware)
 * 
 * @example
 * // Get all songs with pagination and sorting
 * const songs = await getAllSongs({
 *    limit: 20, 
 *   offset: 0 ,
 *   sort: ["title", "-artistId"],
 *   include: ['artist']
 * });
 */
export async function getAllSongs(query?: QueryInput): Promise<Song[]> {
  const includeArtist = query?.include?.includes('artist') ?? false;
  const select = buildSelectFields(query?.fields, includeArtist); // Build the SELECT clause based on requested fields

  const params: any[] = [];

  let sql = `SELECT ${select} FROM songs s`;

  // Include artist information if requested
  // Note: Service layer validates that sorting by artist_name requires include[artist]=true
  if (includeArtist) {
    sql += " LEFT JOIN artists a ON s.artist_id = a.id";
  }

  // Handle sorting if provided (using names from domain)
  // Note: Sort fields are validated in domain service layer (whitelist)
  if (query?.sort && query.sort.length > 0) {
    const sortFields = query.sort.map(field => {
      const isDescending = field.startsWith("-");
      const fieldName = isDescending ? field.slice(1) : field;
      
      // Map domain field names to database column names
      // Security: Whitelist prevents SQL injection - only allow known fields
      const dbFieldMap: Record<string, string> = {
        id: 's.id',
        title: 's.title',
        url: 's.url',
        artistId: 's.artist_id',
        artistName: 'a.name',
      };

     
      
      // Security: Throw error if field not in whitelist (defense in depth)
      // Service layer validates, but repository should also enforce
      const dbField = dbFieldMap[fieldName];
      if (!dbField) {
        throw new Error(`Invalid sort field: ${fieldName}. This should have been caught by service layer validation.`);
      }
      
      return isDescending ? `${dbField} DESC` : dbField;
    });

    sql += ` ORDER BY ${sortFields.join(", ")}`;
  }

    // Handle pagination if provided
    // Note: controller sets defaults
    //Note:  validation made in request validation middleware and service
    if (query?.limit !== undefined && query?.offset !== undefined) {
      sql += " LIMIT ? OFFSET ?";
      params.push(query.limit, query.offset);
    }

  // Execute query with the parameters
  //logger.debug("getAllSongs - SQL query", { sql, params });
  const [rows] = await pool.query(sql, params);
  
  // Map each row to the Song domain model
  const result: Song[] =  (rows as any[]).map(row => mapRow(row, includeArtist));

  return result;
}


/**
 * Get a single song by ID with optional field selection and expansion
 * 
 * @param id - Song ID (UUID)
 * @param query - Optional query parameters for field selection and expansion
 * @param query.fields - Optional field selection (title, url, artistId). id is always returned
 * @param query.include - Optional expansion options (e.g., artist information)
 * @returns Song object if found, null if not found
 * @throws Database errors may be thrown (handled by error middleware)
 * 
 * @example
 * // Get song with artist information
 * const song = await getSongById("song-id", {
 *   include: ['artist'],
 *   fields: ['title', 'url']
 * });
 */
export async function getSongById(id: string, query?: QueryInput): Promise<Song | null> {
  const includeArtist = query?.include?.includes('artist') ?? false;
  const select = buildSelectFields(query?.fields, includeArtist);

  const params: any[] = [];
  let sql = `SELECT ${select} FROM songs s`;

  if (includeArtist) {
    sql += " LEFT JOIN artists a ON s.artist_id = a.id";
  }

  sql += " WHERE s.id = ?";
  params.push(id);

  //logger.debug("getSongById - SQL query", { sql, params });
  const [rows] = await pool.query(sql, params);
  const result = rows as any[];
  return result.length ? mapRow(result[0], includeArtist) : null;
}

/**
 * Create a new song in the database
 * 
 * @param input - Song creation input with required and optional fields
 * @param input.title - Song title (required)
 * @param input.artistId - Artist ID (required, UUID)
 * @param input.url - Song URL (optional)
 * @returns The generated UUID of the newly created song
 * @throws Database errors may be thrown (e.g., foreign key constraint violations) Haldled by error middleware
 * 
 * @example
 * const songId = await createSong({
 *   title: "My Song",
 *   artistId: "artist-uuid",
 *   url: "https://example.com/song.mp3"
 * });
 */
export async function createSong(input: SongCreateInput): Promise<string> {
  const id = randomUUID();
  const sql = `INSERT INTO songs (id, title, artist_id, url) VALUES (?, ?, ?, ?)`;
  const params = [id, input.title, input.artistId, input.url ?? null];
  //logger.debug("createSong - SQL query", { sql, params });
  await pool.query(sql, params);
  return id;
}

/**
 * Update a song with partial update support
 * Only updates fields that are provided (not undefined). Fields not provided remain unchanged.
 * 
 * Service and request validator ensure at least one field is provided
 * 
 * @param id - Song ID (UUID) to update
 * @param input - Partial update input. All fields are optional
 * @param input.title - Song title (optional, only updates if provided)
 * @param input.artistId - Artist ID (optional, only updates if provided)
 * @param input.url - Song URL (optional, only updates if provided)
 * @returns true if song was found and updated, false if song not found or no fields to update
 * @throws Database errors may be thrown (e.g., foreign key constraint violations), handled by error middleware
 * 
 * @example
 * // Update only the title
 * const updated = await updateSong("song-id", { title: "New Title" });
 * 
 * // Update multiple fields
 * const updated = await updateSong("song-id", { 
 *   title: "New Title", 
 *   url: "https://example.com/new.mp3" 
 * });
 */
export async function updateSong(id: string, input: SongUpdateInput): Promise<boolean> {
  // Build SET clauses and params only for provided fields
  const setClauses: string[] = [];
  const params: any[] = [];

  if (input.title !== undefined) {
    setClauses.push('title = ?');
    params.push(input.title);
  }

  if (input.artistId !== undefined) {
    setClauses.push('artist_id = ?');
    params.push(input.artistId);
  }

  if (input.url !== undefined) {
    setClauses.push('url = ?');
    params.push(input.url);
  }

  // If no fields to update, return false (should be caught by service layer validation)
  if (setClauses.length === 0) {
    return false;
  }

  // Add id to params for WHERE clause
  params.push(id);

  const sql = `UPDATE songs
     SET ${setClauses.join(', ')}
     WHERE id = ?`;
  //logger.debug("updateSong - SQL query", { sql, params });
  const [result] = await pool.query<ResultSetHeader>(sql, params);

  return result.affectedRows > 0;
}


/**
 * Delete a song by ID
 * 
 * @param id - Song ID (UUID) to delete
 * @returns true if song was found and deleted, false if song not found
 * @throws Database errors may be thrown (e.g., foreign key constraint violations if song is referenced), handled by error middleware
 * 
 * @example
 * const deleted = await deleteSong("song-id");
 * if (deleted) {
 *   console.log("Song deleted successfully");
 * }
 */
export async function deleteSong(id: string): Promise<boolean> {
  const sql = `DELETE FROM songs WHERE id = ?`;
  const params = [id];
  //logger.debug("deleteSong - SQL query", { sql, params });
  const [result] = await pool.query<ResultSetHeader>(sql, params);
  return result.affectedRows > 0;
}
