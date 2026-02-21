import { useState, useCallback, useRef } from 'react';

const STORAGE_KEY = 'pogo-raid-favorites';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function save(set: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch { /* ignore */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(load);
  // Keep a ref in sync so isFavorite is stable across renders
  const favRef = useRef(favorites);
  favRef.current = favorites;

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save(next);
      return next;
    });
  }, []);

  // Stable function — doesn't cause downstream re-renders
  const isFavorite = useCallback((id: string) => favRef.current.has(id), []);

  return { favorites, toggle, isFavorite };
}
