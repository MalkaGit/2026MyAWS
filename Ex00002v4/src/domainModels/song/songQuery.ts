//3d
//Domain query input - include (join), fields
export interface SongQuery {
  include?: {
    artist?: boolean;
  };

  fields?: {
    id?: boolean;
    title?: boolean;
    url?: boolean;
    artistId?: boolean;
  };

  pagination?: {
    limit: number;   // max number of items to return
    offset: number;  // number of items to skip
  };

  /**
   * Sorting
   * Example: ?sort=title,-date
   * - Field to sort by (e.g., title, artist_name)
   * - Prefix "-" for descending order (e.g., "-date" for descending)
   */
  sort?: string;
}

  