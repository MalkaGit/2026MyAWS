export interface Song {
  id: number;
  title: string;
  artist: string;
}

export class SongService {
  private songs: Song[] = [
    { id: 1, title: "Song One", artist: "Artist A" },
    { id: 2, title: "Song Two", artist: "Artist B" }
  ];

  public async getAll(): Promise<Song[]> {
    // simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.songs), 100);
    });
  }
}
