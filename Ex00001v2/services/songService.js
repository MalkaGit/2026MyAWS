// services/songService.js
//not using classes
//methods are async
class NotFoundError extends Error {}
class BadRequestError extends Error {}

let songs = [
  { id: "1", title: "Song A", artist: "Artist X" },
  { id: "2", title: "Song B", artist: "Artist Y" },
  { id: "3", title: "Song C", artist: "Artist Z" },
];

// Helper to generate new IDs
const generateId = () => (songs.length + 1).toString();

/**
 * Get all songs
 */
async function getAll() {
  return songs; // async wrap it in Promise
}

/**
 * Get song by ID
 */
async function getById(id) {
  const song = songs.find((s) => s.id === id);
  return song || null; // async wrap it in Promise
}

/**
 * Insert new song
 */
async function insert(data) {
  if (!data?.title || !data?.artist) {
    throw new BadRequestError("Title and artist required");
  }

  const newSong = {
    id: generateId(),
    title: data.title,
    artist: data.artist,
  };

  songs.push(newSong);
  return newSong;// async wrap it in Promise
}

/**
 * Update an existing song
 */
async function update(id, data) {
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

  return; // resolves to undefined
}

/**
 * Delete a song
 */
async function remove(id) {
  const index = songs.findIndex((s) => s.id === id);

  if (index === -1) return false;

  songs.splice(index, 1);
  return true; // async wrap it in Promise
}

module.exports = {
  getAll,
  getById,
  insert,
  update,
  delete: remove,
  NotFoundError,
  BadRequestError,
};
