/**
 * Deterministic generative cover art.
 *
 * Phase 1 has no uploaded images, so covers/avatars are rendered as gradients
 * derived from a seed string (an id or a title). The same seed always yields the
 * same gradient, which keeps the UI stable across renders and reloads. In Phase 2
 * a real `coverUrl`/`avatarUrl` simply takes precedence over these.
 */

function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  return Math.abs(hash);
}

/** A two-stop gradient background derived from the seed. */
export function coverGradient(seed: string): React.CSSProperties {
  const hash = hashString(seed);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 35 + (hash % 70)) % 360;
  return {
    backgroundImage: `linear-gradient(145deg, oklch(0.62 0.15 ${hue1}), oklch(0.4 0.13 ${hue2}))`,
  };
}

/** A softer gradient for avatars. */
export function avatarGradient(seed: string): React.CSSProperties {
  const hash = hashString(seed);
  const hue = hash % 360;
  return {
    backgroundImage: `linear-gradient(140deg, oklch(0.66 0.13 ${hue}), oklch(0.5 0.12 ${(hue + 50) % 360}))`,
  };
}

/** First “grapheme” of a label, used as a faint glyph on generated covers. */
export function coverInitial(label: string): string {
  return [...label.trim()][0] ?? "♪";
}
