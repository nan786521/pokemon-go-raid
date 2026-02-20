import type { Boss } from '../types';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  bosses: Boss[];
  onSelect: (bossId: string) => void;
}

export function CurrentBossBanner({ bosses, onSelect }: Props) {
  if (bosses.length === 0) return null;

  return (
    <div className="rounded-xl bg-gradient-to-r from-red-500 to-orange-400 p-3 text-white shadow-md">
      <h2 className="mb-2 text-sm font-bold">目前輪換中的頭目</h2>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto">
        {bosses.map(b => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-white/20 p-2 transition hover:bg-white/30 active:bg-white/40"
          >
            <img
              src={getSpriteUrl(b.pokemon_id)}
              alt={b.name['zh-TW']}
              className="h-10 w-10"
              loading="lazy"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="max-w-[4.5rem] truncate text-xs font-medium">{b.name['zh-TW']}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
