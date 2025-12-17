//2 express route and error hadling 
//  handling songService exceptions and other un-expected exceptions
//  later we can seperate it

import { Router } from "express";
import * as songService from "../services/songService";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const songs = await songService.getAll();
    res.json(songs);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const song = await songService.getById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const song = await songService.insert(req.body);
    res.status(201).json(song);
  } catch (err: unknown) {
    if (err instanceof songService.BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await songService.update(req.params.id, req.body);
    res.sendStatus(204);
  } catch (err: unknown) {
    if (err instanceof songService.NotFoundError) {
      return res.status(404).json({ message: err.message });
    }
    if (err instanceof songService.BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await songService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.sendStatus(204);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
