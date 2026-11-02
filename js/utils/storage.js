/**
 * localStorage access that never throws
 * @module Storage
 * @description With site data blocked, merely reading the localStorage property throws a SecurityError, and a full quota makes setItem throw. Either one, uncaught in a DOMContentLoaded handler, aborted every init after it and left the page blank. Every module goes through here instead, so a browser that refuses storage gets a site that works and simply forgets once the page is left.
 */

/* What the browser refused to store, kept for this page's lifetime: without
   it, a visitor who accepts with storage blocked would be asked again on the
   very next submission. */
const refused = new Map();

/**
 * Read a stored value
 * @function readStored
 * @description A value the browser refused is answered from this page's memory. Unreadable storage is otherwise answered like an empty one: every caller already treats null as "nothing recorded", which is the truth when nothing can be.
 * @param {string} key - Storage key
 * @returns {string|null} The stored value, or null when absent or unreadable
 */
export function readStored(key) {
  if (refused.has(key)) {
    return refused.get(key);
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Store a value, or keep it for this page alone when the browser refuses
 * @function writeStored
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {void}
 */
export function writeStored(key, value) {
  try {
    localStorage.setItem(key, value);
    refused.delete(key);
  } catch (error) {
    refused.set(key, value);
    console.warn(`"${key}" kept for this page only:`, error);
  }
}

/**
 * Erase a stored value, warning when the browser refuses
 * @function removeStored
 * @param {string} key - Storage key
 * @returns {void}
 */
export function removeStored(key) {
  refused.delete(key);
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`"${key}" not erased:`, error);
  }
}
