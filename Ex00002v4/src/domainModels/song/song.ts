//3.1
export interface Song {
    id: string;                       // string. always returned (industry best practice)
    title?: string;                   // string | undefined. undefined when not selected via fields
    artistId?: string;                // string | undefined. undefined when not selected via fields 
    url?: string | null;              // string | undefined. undefined when not selected via fields, null when explicitly null in DB
  
    /**
     * Optional expansion
     * Populated only when requested via include=artist
     */
    artist?: {
      id: string;
      name: string;
    };
  }
  