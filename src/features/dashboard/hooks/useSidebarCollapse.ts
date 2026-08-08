"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "timesheetos:sidebar-collapsed";

/* localStorage is an external store, so it is read through
   useSyncExternalStore rather than mirrored into state inside an effect.
   The snapshot is cached because getSnapshot must return a stable value
   between renders. */
const listeners = new Set<() => void>();
let cached: boolean | null = null;

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode / blocked storage — fall back to expanded.
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cached = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): boolean {
  if (cached === null) cached = read();
  return cached;
}

/** The server has no storage, so it always renders expanded. */
function getServerSnapshot(): boolean {
  return false;
}

const subscribeToNothing = () => () => {};

export function useSidebarCollapse() {
  const isCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /* True only after hydration. Lets the caller suppress the width transition
     on first paint, so a restored collapsed state does not animate in. */
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    cached = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Persisting is best-effort; the in-memory value still updates.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { isCollapsed, toggle, isHydrated };
}
