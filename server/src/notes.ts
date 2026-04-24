import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "./db";
import { NoteColor, Priority } from "./types";

export const notesRouter = Router();

// All routes expect req.userId set by middleware
notesRouter.get("/", (req: Request, res: Response) => {
  const db = readDB();
  const notes = db.notes.filter((n) => n.userId === req.userId);
  res.json(notes);
});

notesRouter.post("/", (req: Request, res: Response) => {
  const { title, content, color, priority, pinned } = req.body as {
    title: string; content: string; color: NoteColor; priority: Priority; pinned?: boolean;
  };
  const db = readDB();
  const note = {
    id: uuidv4(),
    userId: req.userId!,
    title: title || "Untitled",
    content: content || "",
    color: color || "yellow",
    priority: priority || "medium",
    pinned: pinned || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.notes.push(note);
  writeDB(db);
  res.status(201).json(note);
});

notesRouter.put("/:id", (req: Request, res: Response) => {
  const db = readDB();
  const idx = db.notes.findIndex((n) => n.id === req.params.id && n.userId === req.userId);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  db.notes[idx] = { ...db.notes[idx], ...req.body, id: db.notes[idx].id, userId: req.userId!, updatedAt: new Date().toISOString() };
  writeDB(db);
  res.json(db.notes[idx]);
});

notesRouter.delete("/:id", (req: Request, res: Response) => {
  const db = readDB();
  const idx = db.notes.findIndex((n) => n.id === req.params.id && n.userId === req.userId);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  db.notes.splice(idx, 1);
  writeDB(db);
  res.json({ ok: true });
});
