import type { Priority } from "../types";
import { PRIORITY_CONFIG } from "../types";

const DOT_COLORS: Record<Priority, string> = {
  urgent: "#ef4444",
  high:   "#f97316",
  medium: "#eab308",
  low:    "#22c55e",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "3px 10px",
      borderRadius: "99px",
      border: "1px solid var(--border)",
      background: "var(--surface2)",
      fontSize: "0.6875rem",
      fontWeight: 600,
      color: DOT_COLORS[priority],
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: DOT_COLORS[priority], display: "inline-block", flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
