"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "timesheetos:theme";

/* The <html data-theme> attribute is the source of truth — the root layout's
   inline script resolves storage + system preference into it before first
   paint, so reading it back avoids re-deriving that logic here. */
const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Persisting is best-effort; the attribute still drives the UI.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark")) {
      document.documentElement.setAttribute("data-theme", event.newValue);
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The server cannot know the visitor's preference, so it renders light. */
function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const toggle = useCallback(() => {
    apply(read() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggle };
}
