/**
 * Thin, safe wrapper around localStorage.
 *
 * IMPORTANT: this is browser-local draft persistence for the current prototype —
 * it is NOT a database and must not be treated as the source of truth. Anything
 * written here is visible only on this device and disappears when the browser
 * data is cleared. Production Gnome must persist these records server-side.
 */

const NAMESPACE = "gnome.v1";

function key(name: string): string {
  return `${NAMESPACE}.${name}`;
}

export function readLocal<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt or unavailable storage should never break rendering.
    return fallback;
  }
}

export function writeLocal<T>(name: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // Quota errors are non-fatal for drafts; fail quietly.
  }
}
