//10
import { Song, SongInput } from "../domain/song";
import * as repo from "../db/songRepository";

class NotFoundError extends Error {}
class BadRequestError extends Error {}


export async function getAll(): Promise<Song[]> {
  return repo.findAll();
}

export async function getById(id: string): Promise<Song | null> {
  return repo.findById(id);
}

export async function insert(data: SongInput | null): Promise<Song> {
  if (!data?.title || !data?.artist) {
    throw new BadRequestError("Title and artist required");
  }

  return repo.insert(data);
}

export async function update(
  id: string,
  data: SongInput | null
): Promise<void> {
  if (!data || (!data.title && !data.artist && data.url === undefined)) {
    throw new BadRequestError("Nothing to update");
  }

  const updated = await repo.update(id, data);
  if (!updated) {
    throw new NotFoundError("Song not found");
  }
}

export async function remove(id: string): Promise<boolean> {
  return repo.remove(id);
}

export { NotFoundError, BadRequestError };
