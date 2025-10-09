/**
 * Lightweight runtime config loader.
 * Attempts to fetch /config.json; falls back to an empty object.
 * Useful to inject secrets/config at deploy time without committing them.
 */
export async function loadRuntimeConfig() {
  try {
    const res = await fetch("/config.json", { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    return {};
  }
}
