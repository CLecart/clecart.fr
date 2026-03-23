/**
 * Lightweight runtime config loader.
 * Attempts to fetch /config.json; falls back to an empty object.
 * Useful to inject secrets/config at deploy time without committing them.
 */
export async function loadRuntimeConfig() {
  try {
    const res = await fetch("/config.json", { cache: "no-store" });
    if (res.status === 404) return {};
    if (!res.ok) {
      console.warn("Runtime config request failed with status:", res.status);
      return {};
    }
    return await res.json();
  } catch (e) {
    console.warn("Runtime config load failed, using defaults:", e);
    return {};
  }
}
