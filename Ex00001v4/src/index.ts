import { SongService } from "./services/songService.js";

async function main() {
  console.log("main started !!");
  const service = new SongService();
  const songs = await service.getAll();
  console.log("All songs:", songs);
}

main().catch(console.error);
