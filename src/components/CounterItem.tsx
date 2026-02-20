import type { Counter } from '../types';
import { TypeBadge } from './TypeBadge';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  counter: Counter;
  rank: number;
}

export function CounterItem({ counter, rank }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/60 p-2 dark:bg-white/10">
      {/* Rank */}
      <span className="w-5 shrink-0 text-center text-sm font-bold text-gray-400">
        {rank}
      </span>

      {/* Sprite */}
      <img
        src={getSpriteUrl(counter.pokemon_id)}
        alt={counter.name['zh-TW']}
        loading="lazy"
        className="h-10 w-10 shrink-0"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {counter.name['zh-TW']}
          </span>
          {counter.is_shadow && (
            <span className="rounded bg-purple-700 px-1 py-px text-[10px] text-white">暴影</span>
          )}
          {counter.is_mega && (
            <span className="rounded bg-gradient-to-r from-pink-500 to-orange-400 px-1 py-px text-[10px] text-white">Mega</span>
          )}
          {counter.accessibility === 'legendary' && (
            <span className="rounded bg-yellow-500 px-1 py-px text-[10px] text-white">傳說</span>
          )}
        </div>

        {/* Moves */}
        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
          <TypeBadge type={counter.fast_move.type} size="sm" />
          <span>{counter.fast_move.name}</span>
          <span className="text-gray-400">/</span>
          <TypeBadge type={counter.charged_move.type} size="sm" />
          <span>{counter.charged_move.name}</span>
          {counter.elite_tm_required && (
            <span title="需要菁英招式機">🎟️</span>
          )}
          {counter.community_day_move && (
            <span title="社群日限定招式">📅</span>
          )}
        </div>
      </div>

      {/* DPS */}
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-red-500">{counter.dps.toFixed(1)}</div>
        <div className="text-[10px] text-gray-400">DPS</div>
      </div>
    </div>
  );
}
