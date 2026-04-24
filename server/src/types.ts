export type Priority = "low" | "medium" | "high" | "urgent";
export type NoteColor = "yellow" | "pink" | "blue" | "green" | "purple" | "orange";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  color: NoteColor;
  priority: Priority;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DB {
  users: User[];
  notes: Note[];
}
