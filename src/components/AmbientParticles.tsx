import { useMemo } from "react";
import type { Theme } from "../types";

/* Seeded pseudo-random so values are stable between renders but unique per particle */
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ── Tree leaves ── */
const LEAF_EMOJIS = ["🍃", "🍂", "🌿", "🍁", "🌱", "🍀", "🌾", "🍃"];
const FALL_CLASSES = ["leaf-a", "leaf-b", "leaf-c", "leaf-d"];

function TreeLeaves() {
  const leaves = useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const r = (offset: number) => seededRand(i * 7 + offset);
    return {
      id: i,
      emoji:    LEAF_EMOJIS[Math.floor(r(0) * LEAF_EMOJIS.length)],
      cls:      FALL_CLASSES[Math.floor(r(1) * FALL_CLASSES.length)],
      left:     `${r(2) * 100}%`,
      top:      0,
      size:     `${0.75 + r(3) * 0.9}rem`,
      duration: `${7 + r(4) * 12}s`,          // 7–19 s
      delay:    `-${r(5) * 18}s`,              // stagger across full cycle
      opacity:  0.55 + r(6) * 0.45,
    };
  }), []);

  return (
    <>
      {leaves.map((l) => (
        <span
          key={l.id}
          className={`particle ${l.cls}`}
          style={{
            left: l.left,
            top: l.top,
            fontSize: l.size,
            animationDuration: l.duration,
            animationDelay: l.delay,
            opacity: l.opacity,
          }}
        >
          {l.emoji}
        </span>
      ))}
    </>
  );
}

/* ── Ocean bubbles ── */
function OceanBubbles() {
  const bubbles = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const r = (o: number) => seededRand(i * 11 + o);
    const size = 6 + r(0) * 18;
    return {
      id: i,
      left:     `${r(1) * 100}%`,
      size,
      duration: `${8 + r(2) * 14}s`,
      delay:    `-${r(3) * 16}s`,
      opacity:  0.08 + r(4) * 0.14,
    };
  }), []);

  return (
    <>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="particle bubble"
          style={{
            left: b.left,
            bottom: 0,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 35% 35%, rgba(180,230,255,.6), rgba(0,180,216,.15))`,
            border: "1px solid rgba(0,180,216,.25)",
            animationDuration: b.duration,
            animationDelay: b.delay,
            opacity: b.opacity * 3,
          }}
        />
      ))}
    </>
  );
}

/* ── Sunset sparkles ── */
const SPARKLE_EMOJIS = ["✨", "🌟", "⭐", "🔥", "🌠", "💫"];

function SunsetSparkles() {
  const sparkles = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const r = (o: number) => seededRand(i * 13 + o);
    return {
      id: i,
      emoji:    SPARKLE_EMOJIS[Math.floor(r(0) * SPARKLE_EMOJIS.length)],
      left:     `${r(1) * 100}%`,
      size:     `${0.6 + r(2) * 0.8}rem`,
      duration: `${9 + r(3) * 10}s`,
      delay:    `-${r(4) * 14}s`,
      opacity:  0.3 + r(5) * 0.5,
    };
  }), []);

  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="particle sparkle"
          style={{
            left: s.left,
            bottom: 0,
            fontSize: s.size,
            animationDuration: s.duration,
            animationDelay: s.delay,
            opacity: s.opacity,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </>
  );
}

/* ── Candy confetti ── */
const CANDY_SHAPES = ["🍬", "🍭", "🌸", "💜", "🩷", "⭐", "✨", "🦋"];

function CandyConfetti() {
  const pieces = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const r = (o: number) => seededRand(i * 9 + o);
    return {
      id: i,
      emoji:    CANDY_SHAPES[Math.floor(r(0) * CANDY_SHAPES.length)],
      cls:      FALL_CLASSES[Math.floor(r(1) * FALL_CLASSES.length)],
      left:     `${r(2) * 100}%`,
      size:     `${0.7 + r(3) * 0.7}rem`,
      duration: `${8 + r(4) * 10}s`,
      delay:    `-${r(5) * 16}s`,
      opacity:  0.4 + r(6) * 0.45,
    };
  }), []);

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`particle ${p.cls}`}
          style={{
            left: p.left,
            top: 0,
            fontSize: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

/* ── Midnight stars ── */
const STAR_SHAPES = ["✦", "✧", "★", "☆", "⋆", "·", "∗"];

function MidnightStars() {
  const stars = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const r = (o: number) => seededRand(i * 17 + o);
    return {
      id: i,
      glyph:    STAR_SHAPES[Math.floor(r(0) * STAR_SHAPES.length)],
      left:     `${r(1) * 100}%`,
      top:      `${r(2) * 100}%`,
      size:     `${0.4 + r(3) * 1.2}rem`,
      duration: `${3 + r(4) * 6}s`,
      delay:    `-${r(5) * 8}s`,
      opacity:  0.3 + r(6) * 0.7,
      color:    r(7) > 0.5 ? "#c4b5fd" : "#e0e7ff",
    };
  }), []);

  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          className="particle star"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDuration: s.duration,
            animationDelay: s.delay,
            opacity: s.opacity,
            color: s.color,
          }}
        >
          {s.glyph}
        </span>
      ))}
    </>
  );
}

/* ── Coffee steam ── */
function CoffeeSteam() {
  const wisps = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const r = (o: number) => seededRand(i * 19 + o);
    const size = 20 + r(0) * 40;
    return {
      id: i,
      left:     `${20 + r(1) * 60}%`,
      bottom:   `${r(2) * 20}%`,
      size,
      duration: `${6 + r(3) * 8}s`,
      delay:    `-${r(4) * 10}s`,
      opacity:  0.05 + r(5) * 0.1,
    };
  }), []);

  return (
    <>
      {wisps.map((w) => (
        <div
          key={w.id}
          className="particle steam"
          style={{
            left: w.left,
            bottom: w.bottom,
            width: w.size,
            height: w.size,
            background: "rgba(200,160,80,.3)",
            animationDuration: w.duration,
            animationDelay: w.delay,
            opacity: w.opacity,
          }}
        />
      ))}
    </>
  );
}

/* ── Main export ── */
export default function AmbientParticles({ theme }: { theme: Theme }) {
  if (theme === "tree")     return <TreeLeaves />;
  if (theme === "ocean")    return <OceanBubbles />;
  if (theme === "sunset")   return <SunsetSparkles />;
  if (theme === "candy")    return <CandyConfetti />;
  if (theme === "midnight") return <MidnightStars />;
  if (theme === "coffee")   return <CoffeeSteam />;
  return null;
}
