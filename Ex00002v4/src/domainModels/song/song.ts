//3a 
// domain model - read opertions
export interface Song {
    id: string;
    title: string;
    artistId: string;
    url?: string;
  
    /**
     * Optional expansion
     * Populated only when requested via include=artist
     */
    artist?: {
      id: string;
      name: string;
    };
  }
  