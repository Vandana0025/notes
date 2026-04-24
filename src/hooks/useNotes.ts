import { useState, useCallback } from "react";
import type { Note } from "../types";
import { api } from "../api/client";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.notes.list();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (body: Partial<Note>) => {
    const note = await api.notes.create(body);
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = async (id: string, body: Partial<Note>) => {
    const updated = await api.notes.update(id, body);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const deleteNote = async (id: string) => {
    await api.notes.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote };
}
