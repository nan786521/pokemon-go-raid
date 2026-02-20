import type { Counter } from '../types';
import { CounterItem } from './CounterItem';

interface Props {
  counters: Counter[];
}

export function CounterList({ counters }: Props) {
  const sorted = [...counters].sort((a, b) => b.dps - a.dps);
  return (
    <div className="flex flex-col gap-1.5 p-3 pt-0">
      <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>推薦反制隊伍 (Top {sorted.length})</span>
        <span>依 DPS 排序</span>
      </div>
      {sorted.map((c, i) => (
        <CounterItem key={`${c.pokemon_id}-${c.fast_move.name}`} counter={c} rank={i + 1} />
      ))}
    </div>
  );
}
