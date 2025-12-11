// index.ts
// Keep CommonJS compatibility, use ES Modules
import * as songService from "./services/songService.js";

interface Event {
  body?: string | null;
  rawPath: string;
  requestContext?: {
    http?: {
      method?: string;
    };
  };
}

export async function handler(event: Event) {
  console.log("Incoming event:", event);

  const method = event.requestContext?.http?.method;
  const path = event.rawPath;
  const pathParts = path.split("/").filter(Boolean);

  let body: any = null;
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON",
          rawBody: event.body
        }),
      };
    }
  }

  try {
    // GET /songs
    if (method === "GET" && path === "/songs") {
      const songs = await songService.getAll();
      return { statusCode: 200, body: JSON.stringify(songs) };
    }

    // GET /songs/{id}
    if (method === "GET" && pathParts[0] === "songs" && pathParts[1]) {
      const song = await songService.getById(pathParts[1]);
      if (!song) return { statusCode: 404, body: JSON.stringify({ error: "Song not found" }) };
      return { statusCode: 200, body: JSON.stringify(song) };
    }

    // POST /songs
    if (method === "POST" && path === "/songs") {
      const newSong = await songService.insert(body);
      return { statusCode: 201, body: JSON.stringify(newSong) };
    }

    // PUT /songs/{id}
    if (method === "PUT" && pathParts[0] === "songs" && pathParts[1]) {
      await songService.update(pathParts[1], body);
      const updatedSong = await songService.getById(pathParts[1]);
      return { statusCode: 200, body: JSON.stringify(updatedSong) };
    }

    // DELETE /songs/{id}
    if (method === "DELETE" && pathParts[0] === "songs" && pathParts[1]) {
      const deleted = await songService.remove(pathParts[1]);
      if (!deleted) return { statusCode: 404, body: JSON.stringify({ error: "Song not found" }) };
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    // Fallback for unknown routes
    return { statusCode: 404, body: JSON.stringify({ error: "Route not found", path }) };
  } catch (err: any) {
    if (err instanceof songService.NotFoundError) {
      return { statusCode: 404, body: JSON.stringify({ error: err.message }) };
    }
    if (err instanceof songService.BadRequestError) {
      return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
}
