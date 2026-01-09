//3.2
export interface SongCreateInput {
    title: string;                            //string. Required
    artistId: string;                         //string. Required
    url?: string;                             //string | undefied.  Optional - if undefined, defaults to null in DB
  }
  