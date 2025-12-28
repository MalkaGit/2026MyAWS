//5
import { ResultSetHeader } from "mysql2/promise";
import { randomUUID } from "crypto";
import { pool } from "./shared/db";
import { SongCreateInput } from "../domainModels/song/songCreateInput";
import { SongQuery } from "../domainModels/song/songQuery";
import { Song } from "../domainModels/song/song";
import { SongUpdateInput } from "../domainModels/song/songUpdateInput";


/**
 * Maps DB row to domain Song
 * Note: some fields are undefined on row if not selected
 */
function mapRow(row: any, includeArtist: boolean = true): Song {
  const song: Song = {
    id: row.id,
    title: row.title,
    artistId: row.artist_id,
    url: row.url ?? undefined,
  };

  if (includeArtist && row.artist_id && row.artist_name) {
    song.artist = {
      id: row.artist_id,
      name: row.artist_name,
    };
  }

  return song;
}

/**
 * Build SELECT fields
 * returns all fields when input not given
 * return joined atis fields if should includeArtist
 */
function buildSelectFields(
  fields?: SongQuery["fields"],
  includeArtist = false
): string {
  const selectFields: string[] = [];

  if (!fields || fields.id) selectFields.push("s.id");
  if (!fields || fields.title) selectFields.push("s.title");
  if (!fields || fields.url) selectFields.push("s.url");
  if (!fields || fields.artistId || includeArtist) selectFields.push("s.artist_id");

  if (includeArtist) {
    selectFields.push("a.name AS artist_name");
  }

  return selectFields.join(", ");
}


/**
 * Get all songs
  * note: query is optional. when not given all fields returned, but inlude defaults to false
 * Example:
 * GET /songs?limit=20&offset=0&sort=title,-date&fields=id,title,artist  
 *     offset=0,limit=20: paing- Start from the first song , Fetch 20 songs. 
 *    sort=title,-date: Sort by title (ascending), then date (descending). 
 *    fields=id,title,artist: Return only the id, title, and artist fields (instead of returning all columns).  
 */
export async function getAllSongs(query?: SongQuery): Promise<Song[]> {
  const includeArtist = query?.include?.artist ?? false; // Check if we need to include artist info
  const select = buildSelectFields(query?.fields, includeArtist); // Build the SELECT clause based on requested fields

  let sql = `SELECT ${select} FROM songs s`;
  const params: any[] = [];

  // Include artist information if requested
  if (includeArtist) {
    sql += " LEFT JOIN artists a ON s.artist_id = a.id";
  }



  // Handle sorting if provided
  if (query?.sort) {
    const sortFields = query.sort.split(",").map(field => {
      // Check for descending order (e.g., "-date" means descending by date)
      if (field.startsWith("-")) {
        return `${field.slice(1)} DESC`;
      } else {
        return field;
      }
    });

    sql += ` ORDER BY ${sortFields.join(", ")}`;
  }

    // Handle pagination if provided
    if (query?.pagination) {
      sql += " LIMIT ? OFFSET ?";
      params.push(query.pagination.limit, query.pagination.offset);
    }

  // Execute query with the parameters
  const [rows] = await pool.query(sql, params);
  
  // Map each row to the Song domain model
  return (rows as any[]).map(row => mapRow(row, includeArtist));
}


/**
 * Get song by ID
 * Returns null if not found
 * note: query is optional. when not given all fields returned, but inlude defaults to false
 */
export async function getSongById(id: string, query?: SongQuery): Promise<Song | null> {
  const includeArtist = query?.include?.artist ?? false;
  const select = buildSelectFields(query?.fields, includeArtist);

  let sql = `SELECT ${select} FROM songs s`;
  const params: any[] = [id];

  if (includeArtist) {
    sql += " LEFT JOIN artists a ON s.artist_id = a.id";
  }

  sql += " WHERE s.id = ?";

  const [rows] = await pool.query(sql, params);
  const result = rows as any[];
  return result.length ? mapRow(result[0], includeArtist) : null;
}

/**
 * Create a new song
 * returns the id of the new song
 */
export async function createSong(input: SongCreateInput): Promise<string> {
  const id = randomUUID();
  await pool.query(
    `INSERT INTO songs (id, title, artist_id, url) VALUES (?, ?, ?, ?)`,
    [id, input.title, input.artistId, input.url ?? null]
  );
  return id;
}

/**
 * Update song  (partial update: allows updating **any subset of the song's properties**)
 * reurns indication if song found
 * use COALESCE to preserve existing values if some fields are undefined
 */
export async function updateSong(id: string, input: SongUpdateInput): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE songs
     SET
       title = COALESCE(?, title),
       artist_id = COALESCE(?, artist_id),
       url = COALESCE(?, url)
     WHERE id = ?`,
    [input.title, input.artistId, input.url, id]
  );

  return result.affectedRows > 0;
}


/**
 * Delete song by ID
 *  Returns `true` if the song was successfully deleted, `false` otherwise.
 */
export async function deleteSong(id: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM songs WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}
