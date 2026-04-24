import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../hooks/useNotes";
import type { Theme, Note, Priority } from "../types";
import { PRIORITY_CONFIG } from "../types";
import StickyNote from "../components/StickyNote";
import NoteModal from "../components/NoteModal";
import ThemeToggle from "../components/ThemeToggle";
import AmbientParticles from "../components/AmbientParticles";

interface Props { theme: Theme; setTheme: (t: Theme) => void; }

type SortBy = "updated" | "created" | "priority";
type FilterP = Priority | "all";

const DOT_COLORS: Record<Priority, string> = {
  urgent: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e",
};

export default function DashboardPage({ theme, setTheme }: Props) {
  const { user, logout } = useAuth();
  const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } = useNotes();

  const [modalNote, setModalNote] = useState<Note | null | undefined>(undefined);
  const [search,    setSearch]    = useState("");
  const [filterP,   setFilterP]   = useState<FilterP>("all");
  const [sortBy,    setSortBy]    = useState<SortBy>("updated");
  const [onlyPinned, setOnlyPinned] = useState(false);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const filtered = useMemo(() => {
    let list = [...notes];
    if (search)         list = list.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
    if (filterP !== "all") list = list.filter(n => n.priority === filterP);
    if (onlyPinned)     list = list.filter(n => n.pinned);
    list.sort((a, b) => {
      if (sortBy === "priority") return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
      if (sortBy === "created")  return +new Date(b.createdAt) - +new Date(a.createdAt);
      return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    });
    return [...list.filter(n => n.pinned), ...list.filter(n => !n.pinned)];
  }, [notes, search, filterP, sortBy, onlyPinned]);

  const counts = useMemo(() => ({
    urgent: notes.filter(n => n.priority === "urgent").length,
    high:   notes.filter(n => n.priority === "high").length,
    medium: notes.filter(n => n.priority === "medium").length,
    low:    notes.filter(n => n.priority === "low").length,
  }), [notes]);

  const handleSave = async (data: Partial<Note>) => {
    if (modalNote?.id) await updateNote(modalNote.id, data);
    else await createNote(data);
  };

  /* ─── Pill button helper ─── */
  const pill = (active: boolean, onClick: () => void, children: React.ReactNode, accent?: string) => (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "7px 14px",
        borderRadius: "0.75rem",
        border: `1.5px solid ${active ? (accent || "var(--accent)") : "var(--border)"}`,
        background: active ? (accent ? accent + "18" : "var(--surface2)") : "var(--surface)",
        color: active ? (accent || "var(--accent)") : "var(--text-sub)",
        fontWeight: 600,
        fontSize: "0.8125rem",
        cursor: "pointer",
        transition: "all .15s",
        whiteSpace: "nowrap" as const,
      }}
    >{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <AmbientParticles theme={theme} />

      {/* ═══════════════ NAV ═══════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--nav-blur)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="nav-inner" style={{
          maxWidth: 1400, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {/* Logo */}
          <div className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "0.75rem",
              background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0,
            }}>📝</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--text)" }}>BrainConfetti</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>Hey, {user?.name?.split(" ")[0]} 👋</div>
            </div>
          </div>

          {/* Search */}
          <div className="nav-search" style={{ position: "relative", flex: "1 1 auto", maxWidth: 360 }}>
            <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)", width: 16, height: 16 }}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              style={{
                width: "100%", padding: "10px 16px 10px 38px",
                borderRadius: "0.875rem",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color .15s",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div className="nav-theme" style={{ flexShrink: 1, minWidth: 0 }}>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <button
            className="nav-logout"
            onClick={logout}
            style={{
              padding: "9px 16px",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-sub)",
              fontWeight: 600,
              fontSize: "0.8125rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >Sign out</button>
        </div>
      </header>

      {/* ═══════════════ MAIN ═══════════════ */}
      <main className="dashboard" style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 40px", position: "relative", zIndex: 1 }}>

        {/* ── Stats cards ── */}
        <div className="stat-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 40,
        }}>
          {(["urgent", "high", "medium", "low"] as Priority[]).map(p => (
            <button
              key={p}
              onClick={() => setFilterP(filterP === p ? "all" : p)}
              style={{
                padding: "20px 24px",
                borderRadius: "1.25rem",
                border: filterP === p ? `2px solid ${DOT_COLORS[p]}` : "1px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "var(--shadow)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: DOT_COLORS[p], display: "inline-block" }} />
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text-sub)" }}>
                  {p}
                </span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
                {counts[p]}
              </div>
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 24, flexWrap: "wrap",
        }}>
          {/* New note */}
          <button
            onClick={() => setModalNote(null)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px",
              borderRadius: "0.875rem",
              border: "none",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 15, height: 15 }}>
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New note
          </button>

          {/* Pinned toggle */}
          {pill(onlyPinned, () => setOnlyPinned(!onlyPinned), "📌 Pinned")}

          {/* Priority pills */}
          {(["all", "urgent", "high", "medium", "low"] as FilterP[]).map(p =>
            pill(
              filterP === p,
              () => setFilterP(p),
              p === "all"
                ? "All"
                : <><span style={{ width: 7, height: 7, borderRadius: "50%", background: DOT_COLORS[p], display: "inline-block" }} />{PRIORITY_CONFIG[p].label}</>,
              p === "all" ? undefined : DOT_COLORS[p],
            )
          )}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              style={{
                padding: "8px 14px",
                borderRadius: "0.75rem",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: "0.8125rem",
                fontFamily: "inherit",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="updated">Last updated</option>
              <option value="created">Date created</option>
              <option value="priority">Priority</option>
            </select>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-sub)", whiteSpace: "nowrap" }}>
              {filtered.length} {filtered.length === 1 ? "note" : "notes"}
            </span>
          </div>
        </div>

        {/* ── Notes grid ── */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTopColor: "var(--accent)",
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="anim-fade-up" style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>{notes.length === 0 ? "📝" : "🔍"}</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)" }}>
              {notes.length === 0 ? "No notes yet" : "Nothing found"}
            </h3>
            <p style={{ margin: "0 0 28px", color: "var(--text-sub)", fontSize: "0.9375rem" }}>
              {notes.length === 0 ? "Create your first sticky note to get started" : "Try a different search or filter"}
            </p>
            {notes.length === 0 && (
              <button
                onClick={() => setModalNote(null)}
                style={{
                  padding: "12px 28px",
                  borderRadius: "0.875rem",
                  border: "none",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                }}
              >Create first note</button>
            )}
          </div>
        ) : (
          <div
            className="note-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2.5rem",
              alignItems: "start",
              paddingTop: 8,
            }}
          >
            {filtered.map((note, i) => (
              <StickyNote
                key={note.id}
                note={note}
                index={i}
                onEdit={setModalNote}
                onDelete={deleteNote}
                onTogglePin={(id, pinned) => updateNote(id, { pinned })}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      {modalNote !== undefined && (
        <NoteModal note={modalNote} onSave={handleSave} onClose={() => setModalNote(undefined)} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
