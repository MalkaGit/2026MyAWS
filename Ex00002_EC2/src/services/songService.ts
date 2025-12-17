//1
class NotFoundError extends Error {}
class BadRequestError extends Error {}

export interface Song {
  id: string;
  title: string;
  artist: string;
}

export interface SongInput {
  title?: string;
  artist?: string;
}

let songs: Song[] = [
  { id: "1", title: "Song A", artist: "Artist XX" },
  { id: "2", title: "Song B", artist: "Artist YY" },
  { id: "3", title: "Song C", artist: "Artist ZZ" },
];

// New: get max existing ID + 1
const generateId = (): string => {
  if (songs.length === 0) return "1"; // start from 1
  const maxId = Math.max(...songs.map(s => parseInt(s.id, 10)));
  return (maxId + 1).toString();
};

export async function getAll(): Promise<Song[]> {
  return songs;
}

export async function getById(id: string): Promise<Song | null> {
  const song = songs.find((s) => s.id === id);
  return song || null;
}

export async function insert(data: SongInput | null): Promise<Song> {
  if (!data?.title || !data?.artist) {
    throw new BadRequestError("Title and artist required");
  }

  const newSong: Song = {
    id: generateId(),
    title: data.title,
    artist: data.artist,
  };

  songs.push(newSong);
  return newSong;
}

export async function update(id: string, data: SongInput | null): Promise<void> {
  const index = songs.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new NotFoundError("Song not found");
  }

  if (!data || (!data.title && !data.artist)) {
    throw new BadRequestError("Nothing to update");
  }

  songs[index] = {
    id,
    title: data.title ?? songs[index].title,
    artist: data.artist ?? songs[index].artist,
  };
}

export async function remove(id: string): Promise<boolean> {
  const index = songs.findIndex((s) => s.id === id);

  if (index === -1) return false;

  songs.splice(index, 1);
  return true;
}

export { NotFoundError, BadRequestError };
