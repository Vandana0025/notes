import type { Theme } from "../types";

const OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: "light",    icon: "☀️",  label: "Light"    },
  { value: "dark",     icon: "🌙",  label: "Dark"     },
  { value: "tree",     icon: "🌿",  label: "Tree"     },
  { value: "ocean",    icon: "🌊",  label: "Ocean"    },
  { value: "sunset",   icon: "🌅",  label: "Sunset"   },
  { value: "candy",    icon: "🍬",  label: "Candy"    },
  { value: "midnight", icon: "🌌",  label: "Midnight" },
  { value: "coffee",   icon: "☕",  label: "Coffee"   },
];

export default function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="theme-strip" style={{
      display: "flex",
      alignItems: "center",
      gap: "2px",
      padding: "4px",
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: "0.875rem",
      flexWrap: "nowrap",
    }}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          title={o.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 10px",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontSize: "0.8125rem",
            fontWeight: 600,
            transition: "all .15s",
            background: theme === o.value ? "var(--surface)" : "transparent",
            color: theme === o.value ? "var(--text)" : "var(--text-sub)",
            boxShadow: theme === o.value ? "var(--shadow)" : "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>{o.icon}</span>
          <span style={{ display: "none" }} className="theme-label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
