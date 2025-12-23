export interface Song {
    id: string;         // UUID
    title: string;
    artistId: string;   // 
    artistName: string; // not in song table, saves 2 calls 
    url?: string | null;
  }
  