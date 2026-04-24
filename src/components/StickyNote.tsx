import { useState } from "react";
import type { Note } from "../types";
import PriorityBadge from "./PriorityBadge";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  index: number;
}

const ROTATIONS = [-1.8, 0.9, -0.6, 1.4, -1.1, 0.5, -0.3, 1.7];

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (d < 1)  return "just now";
  if (d < 60) return `${d}m ago`;
  const h = Math.floor(d / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function StickyNote({ note, onEdit, onDelete, onTogglePin, index }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rot = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className={`nc-${note.color}`}
      onClick={() => onEdit(note)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirm(false); }}
      style={{
        /* Geometry */
        position: "relative",
        borderRadius: "1.25rem",
        overflow: "hidden",          /* ← clips children to rounded corners */
        display: "flex",
        flexDirection: "column",
        minHeight: "220px",
        cursor: "pointer",
        /* Colours */
        background: "var(--nb)",
        border: "1.5px solid var(--nd)",
        /* Shadow & rotation */
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,.22)"
          : "3px 4px 14px rgba(0,0,0,.13)",
        transform: hovered ? "rotate(0deg) translateY(-3px)" : `rotate(${rot}deg)`,
        transition: "transform .22s ease, box-shadow .22s ease",
      }}
    >
      {/* ── Tape strip ── */}
      <div style={{
        position: "absolute",
        top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 52, height: 18,
        borderRadius: "0 0 6px 6px",
        background: "var(--nd)",
        opacity: .5,
        zIndex: 1,
      }} />

      {/* ── Pin dot ── */}
      {note.pinned && (
        <span style={{ position: "absolute", top: 12, right: 14, fontSize: "1rem", zIndex: 2 }}>📌</span>
      )}

      {/* ── Body ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "28px 20px 20px" }}>
        {/* Title */}
        <p style={{
          margin: 0,
          fontWeight: 700,
          fontSize: "0.9375rem",
          lineHeight: 1.35,
          color: "var(--nt)",
          marginBottom: 10,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {note.title || "Untitled"}
        </p>

        {/* Content */}
        <p style={{
          margin: 0,
          flex: 1,
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          color: "var(--nt)",
          opacity: .7,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {note.content || "No content yet…"}
        </p>

        {/* Footer row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid var(--nd)",
        }}>
          <PriorityBadge priority={note.priority} />
          <span style={{ fontSize: "0.6875rem", color: "var(--nt)", opacity: .45, flexShrink: 0 }}>
            {timeAgo(note.updatedAt)}
          </span>
        </div>
      </div>

      {/* ── Hover / touch actions ── */}
      <div className="note-actions" style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "10px 14px",
        background: `linear-gradient(to top, var(--nd) 0%, transparent 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 6,
        opacity: hovered ? 1 : 0,
        transition: "opacity .18s",
        pointerEvents: hovered ? "auto" : "none",
      }}>
        {/* Pin */}
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(note.id, !note.pinned); }}
          title={note.pinned ? "Unpin" : "Pin"}
          style={{
            width: 30, height: 30,
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            cursor: "pointer",
            fontSize: "0.875rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {note.pinned ? "📍" : "📌"}
        </button>

        {/* Delete */}
        {confirm ? (
          <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onDelete(note.id)}
              style={{
                padding: "4px 10px",
                borderRadius: "0.5rem",
                border: "1px solid #fca5a5",
                background: "var(--surface)",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >Delete</button>
            <button
              onClick={() => setConfirm(false)}
              style={{
                padding: "4px 10px",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-sub)",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >Cancel</button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirm(true); }}
            title="Delete"
            style={{
              width: 30, height: 30,
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              fontSize: "0.875rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >🗑️</button>
        )}
      </div>
    </div>
  );
}
