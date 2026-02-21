import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pogo-raid-recent';
const MAX_RECENT = 10;

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function save(list: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<string[]>(load);

  const add = useCallback((id: string) => {
    setRecent(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX_RECENT);
      save(next);
      return next;
    });
  }, []);

  return { recent, add };
}
