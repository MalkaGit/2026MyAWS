//8
// domain

export interface Song {
    id: string;
    title: string;
    artist: string;
    url: string | null;
  }
  
  export interface SongInput {
    title?: string;
    artist?: string;
    url?: string | null;
  }
  
