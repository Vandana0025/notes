import { useState, useEffect } from "react";
import type { Note, NoteColor, Priority } from "../types";
import { NOTE_COLORS, PRIORITY_CONFIG } from "../types";

const COLOR_HEX: Record<NoteColor, string> = {
  yellow: "#fef9c3", pink: "#fce7f3", blue: "#dbeafe",
  green:  "#dcfce7", purple: "#f3e8ff", orange: "#ffedd5",
};

const DOT_COLORS: Record<Priority, string> = {
  urgent: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e",
};

interface Props {
  note?: Note | null;
  onSave: (data: Partial<Note>) => Promise<void>;
  onClose: () => void;
}

const S: { [k: string]: React.CSSProperties } = {
  label: {
    display: "block",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: ".08em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
    color: "var(--text-sub)",
  },
};

export default function NoteModal({ note, onSave, onClose }: Props) {
  const [title,    setTitle]    = useState(note?.title    ?? "");
  const [content,  setContent]  = useState(note?.content  ?? "");
  const [color,    setColor]    = useState<NoteColor>(note?.color    ?? "yellow");
  const [priority, setPriority] = useState<Priority>(note?.priority ?? "medium");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave({ title, content, color, priority }); onClose(); }
    finally { setSaving(false); }
  };

  /* Input base style */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "0.875rem",
    border: "1.5px solid var(--border)",
    background: "var(--surface2)",
    color: "var(--text)",
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color .15s",
    fontFamily: "inherit",
  };

  return (
    /* Backdrop */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        background: "rgba(0,0,0,.55)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Modal card */}
      <div
        className="anim-pop-in"
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          borderRadius: "1.5rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>
            {note ? "Edit note" : "New note"}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: "0.625rem",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--text-sub)",
              cursor: "pointer",
              fontSize: "0.875rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title…"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note…"
              rows={6}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Priority</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    borderRadius: "0.75rem",
                    border: priority === p ? `2px solid ${DOT_COLORS[p]}` : "1.5px solid var(--border)",
                    background: priority === p ? "var(--surface2)" : "transparent",
                    color: priority === p ? DOT_COLORS[p] : "var(--text-sub)",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOT_COLORS[p], flexShrink: 0 }} />
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div>
            <label style={S.label}>Colour</label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  style={{
                    width: 34, height: 34,
                    borderRadius: "50%",
                    border: color === c ? "3px solid var(--text)" : "2px solid transparent",
                    background: COLOR_HEX[c],
                    cursor: "pointer",
                    transform: color === c ? "scale(1.2)" : "scale(1)",
                    transition: "all .15s",
                    outline: color === c ? "2px solid var(--surface)" : "none",
                    outlineOffset: "-5px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex",
          gap: 10,
          padding: "20px 24px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "0.875rem",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--text-sub)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: "0.875rem",
              border: "none",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? .65 : 1,
            }}
          >
            {saving ? "Saving…" : note ? "Save changes" : "Add note"}
          </button>
        </div>
      </div>
    </div>
  );
}
