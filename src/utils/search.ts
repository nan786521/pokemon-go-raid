import type { Boss } from '../types';

export function matchesBoss(boss: Boss, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const name = boss.name;
  if (name['zh-TW'].toLowerCase().includes(q)) return true;
  if (name.en.toLowerCase().includes(q)) return true;
  if (name.ja.toLowerCase().includes(q)) return true;
  if (boss.aliases.some(a => a.toLowerCase().includes(q))) return true;
  if (boss.id.toLowerCase().includes(q)) return true;
  return false;
}
