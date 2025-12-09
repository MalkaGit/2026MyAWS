// index.js

let songs = [
  { id: "1", title: "Song A", artist: "Artist X" },
  { id: "2", title: "Song B", artist: "Artist Y" },
  { id: "3", title: "Song C", artist: "Artist Z" },
];

// Helper to generate new IDs
const generateId = () => (songs.length + 1).toString();

async function handler(event) {
  console.log("Incoming event:", event); // Log the full event for debugging

  // -------------------------
  // Normalize path to avoid extra slashes
  /*
  const path = (event.rawPath ?? event.path ?? "/").toString();
  const pathParts = path.split("/").filter(Boolean);  // Split and clean the path

  const method = event.httpMethod;
  let body = null;

  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }
*/
  const method = event.requestContext?.http?.method;
  const path = event.rawPath;
  const pathParts = path.split("/").filter(Boolean);
  
  let body = null;
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON", rawBody: event.body }) };
    }
  }


  // -------------------------
  // GET /songs - Return all songs
  if (method === "GET" && path === "/songs") {
    return { statusCode: 200, body: JSON.stringify(songs) };
  }

  // -------------------------
  // GET /songs/{id} - Get a specific song by ID
  if (method === "GET" && pathParts[0] === "songs" && pathParts[1]) {
    const songId = pathParts[1]; // Get the song ID from the path
    const song = songs.find((s) => s.id === songId);
    if (!song) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "Song not found", path: path }) 
      };
    }
    return { statusCode: 200, body: JSON.stringify(song) };
  }

  // -------------------------
  // POST /songs - Create a new song
  if (method === "POST" && path === "/songs") {
    if (!body?.title || !body?.artist) {
      return { statusCode: 400, body: JSON.stringify({ error: "Title and artist required" }) };
    }
    const newSong = { id: generateId(), title: body.title, artist: body.artist };
    songs.push(newSong);
    return { statusCode: 201, body: JSON.stringify(newSong) };
  }

  // -------------------------
  // PUT /songs/{id} - Update an existing song
  if (method === "PUT" && pathParts[0] === "songs" && pathParts[1]) {
    const songId = pathParts[1];
    const songIndex = songs.findIndex((s) => s.id === songId);
    if (songIndex === -1) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "Song not found", path: path }) 
      };
    }

    songs[songIndex] = {
      id: songId,
      title: body?.title ?? songs[songIndex].title,
      artist: body?.artist ?? songs[songIndex].artist,
    };
    return { statusCode: 200, body: JSON.stringify(songs[songIndex]) };
  }

  // -------------------------
  // DELETE /songs/{id} - Delete a song by ID
  if (method === "DELETE" && pathParts[0] === "songs" && pathParts[1]) {
    const songId = pathParts[1];
    const songIndex = songs.findIndex((s) => s.id === songId);
    if (songIndex === -1) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "Song not found", path: path }) 
      };
    }

    const deletedSong = songs.splice(songIndex, 1)[0];
    return { statusCode: 200, body: JSON.stringify(deletedSong) };
  }

  // -------------------------
  // Fallback route for unknown paths
//   return { 
//     statusCode: 404, 
//     body: JSON.stringify({ error: "Route not found", path: path }) 
//   };
// }
  return {
    statusCode: 404,
    body: JSON.stringify({
      error: "Route not found",
      path,
      event
    })
  };
}

// Export the Lambda handler
module.exports = { handler };
//