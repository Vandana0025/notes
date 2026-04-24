import { useMemo } from "react";

const LEAVES = ["🍃", "🍂", "🌿", "🍁", "🌱"];

export default function LeafParticles() {
  const leaves = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: LEAVES[i % LEAVES.length],
      left: `${(i * 8.3) % 100}%`,
      duration: `${8 + (i % 7) * 2}s`,
      delay: `${(i * 1.3) % 10}s`,
      size: `${0.8 + (i % 3) * 0.4}rem`,
    })), []);

  return (
    <>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            animationDuration: leaf.duration,
            animationDelay: `-${leaf.delay}`,
            fontSize: leaf.size,
          }}
        >
          {leaf.emoji}
        </div>
      ))}
    </>
  );
}
