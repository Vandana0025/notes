import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import type { Theme } from "../types";
import ThemeToggle from "../components/ThemeToggle";

interface Props { theme: Theme; setTheme: (t: Theme) => void; }

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "0.875rem",
  border: "1.5px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: "0.9375rem",
  outline: "none",
  transition: "border-color .15s",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function AuthPage({ theme, setTheme }: Props) {
  const [mode,     setMode]     = useState<"login" | "register">("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = mode === "register"
        ? await api.auth.register({ name, email, password })
        : await api.auth.login({ email, password });
      login(res.token, res.user);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "0.75rem",
            background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", flexShrink: 0,
          }}>📝</div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text)" }}>BrainConfetti</span>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      {/* Centred card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div
          className="anim-pop-in"
          style={{
            width: "100%", maxWidth: 440,
            borderRadius: "1.5rem",
            overflow: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Card header */}
          <div style={{
            padding: "32px 32px 28px",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>
              {mode === "login" ? "👋" : "✨"}
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-sub)" }}>
              {mode === "login"
                ? "Sign in to access your notes"
                : "Start organising your thoughts today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ padding: "28px 32px 32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {mode === "register" && (
                <div className="anim-fade-up">
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-sub)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".07em" }}>Name</label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name" required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-sub)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".07em" }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-sub)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".07em" }}>Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {error && (
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "0.75rem",
                  background: "rgba(239,68,68,.1)",
                  border: "1px solid rgba(239,68,68,.25)",
                  color: "#ef4444",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  borderRadius: "0.875rem",
                  border: "none",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? .65 : 1,
                  marginTop: 4,
                }}
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>

              <p style={{ margin: 0, textAlign: "center", fontSize: "0.875rem", color: "var(--text-sub)" }}>
                {mode === "login" ? "No account? " : "Already signed up? "}
                <button
                  type="button"
                  onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
                  style={{
                    background: "none", border: "none",
                    color: "var(--accent)", fontWeight: 700,
                    fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  {mode === "login" ? "Sign up free" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
