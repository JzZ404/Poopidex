import { CollectionEntry, ScatCard } from "./types";

const STORAGE_KEY = "poopidex:collection";
const UPDATE_EVENT = "poopidex:collection-updated";

export function getCollection(): CollectionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CollectionEntry[];
  } catch {
    return [];
  }
}

export function addToCollection(card: ScatCard): CollectionEntry {
  const entry: CollectionEntry = {
    id: crypto.randomUUID(),
    card,
    collectedAt: new Date().toISOString(),
  };
  const current = getCollection();
  const next = [entry, ...current];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATE_EVENT));
  return entry;
}

export function removeFromCollection(id: string): void {
  const next = getCollection().filter((e) => e.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function clearCollection(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

/* Temporary "in-flight" identification — passed between Identify screens
   without query-stringing a giant JSON. Used because we don't have backend persistence yet. */
const PENDING_KEY = "poopidex:pending-card";

export function setPendingCard(card: ScatCard): void {
  window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(card));
}

export function getPendingCard(): ScatCard | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScatCard;
  } catch {
    return null;
  }
}

export function clearPendingCard(): void {
  window.sessionStorage.removeItem(PENDING_KEY);
}
