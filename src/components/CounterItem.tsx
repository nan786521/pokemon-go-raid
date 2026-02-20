import type { Counter, CounterRole } from '../types';
import { TypeBadge } from './TypeBadge';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  counter: Counter;
  rank?: number;
  compact?: boolean;
}

const ROLE_STYLE: Record<CounterRole, { label: string; cls: string }> = {
  attacker: { label: '攻擊', cls: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
  tank:     { label: '坦克', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  healer:   { label: '補師', cls: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
};

export function CounterItem({ counter, rank, compact }: Props) {
  const role = counter.role ?? 'attacker';
  const rs = ROLE_STYLE[role];

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-white/60 px-2 py-1.5 dark:bg-white/10">
        <img
          src={getSpriteUrl(counter.pokemon_id)}
          alt={counter.name['zh-TW']}
          loading="lazy"
          className="h-8 w-8 shrink-0"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className={`rounded px-1 py-px text-[10px] font-bold ${rs.cls}`}>{rs.label}</span>
            <span className="truncate text-xs font-bold text-gray-900 dark:text-white">{counter.name['zh-TW']}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <span>{counter.fast_move.name}</span>
            <span>/</span>
            <span>{counter.charged_move.name}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/60 p-2 dark:bg-white/10">
      {/* Rank */}
      {rank != null && (
        <span className="w-5 shrink-0 text-center text-sm font-bold text-gray-400">
          {rank}
        </span>
      )}

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
          <span className={`rounded px-1 py-px text-[10px] font-bold ${rs.cls}`}>{rs.label}</span>
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
