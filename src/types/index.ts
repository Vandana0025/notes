export type Priority = "low" | "medium" | "high" | "urgent";
export type NoteColor = "yellow" | "pink" | "blue" | "green" | "purple" | "orange";
export type Theme = "light" | "dark" | "tree" | "ocean" | "sunset" | "candy" | "midnight" | "coffee";

export interface User {
  id: string;
  name: string;
  email: string;
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

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string; order: number }> = {
  urgent: { label: "Urgent",  color: "text-red-500",    dot: "bg-red-500",    order: 0 },
  high:   { label: "High",    color: "text-orange-500", dot: "bg-orange-500", order: 1 },
  medium: { label: "Medium",  color: "text-yellow-500", dot: "bg-yellow-500", order: 2 },
  low:    { label: "Low",     color: "text-green-500",  dot: "bg-green-500",  order: 3 },
};

export const NOTE_COLORS: NoteColor[] = ["yellow", "pink", "blue", "green", "purple", "orange"];
