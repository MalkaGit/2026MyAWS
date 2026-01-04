//3.3
export interface SongUpdateInput {
    title?: string;            // string | undefined. undefined - don't update, string - update     
    artistId?: string;         // string | undefined. undefined - don't update, string - update
    url?: string | null;       // string | undefined. undefined - don't update, null - set to null, string - update to string
  }
  