import { useMemo, memo } from 'react';
import type { Counter, Category } from '../types';
import { CounterItem } from './CounterItem';

interface Props {
  counters: Counter[];
  category: Category;
}

export const CounterList = memo(function CounterList({ counters, category }: Props) {
  const isRaid = category === 'raid';

  const { attackers, tanks, healers } = useMemo(() => ({
    attackers: counters.filter(c => c.role === 'attacker').sort((a, b) => b.dps - a.dps),
    tanks: counters.filter(c => c.role === 'tank').sort((a, b) => b.dps - a.dps),
    healers: counters.filter(c => c.role === 'healer').sort((a, b) => b.dps - a.dps),
  }), [counters]);

  const team = useMemo(
    () => isRaid ? [...attackers] : [...attackers, ...tanks, ...healers],
    [isRaid, attackers, tanks, healers]
  );

  const teamLabel = useMemo(() => {
    const parts = [];
    if (attackers.length > 0) parts.push(`${attackers.length}打`);
    if (!isRaid && tanks.length > 0) parts.push(`${tanks.length}坦`);
    if (!isRaid && healers.length > 0) parts.push(`${healers.length}補`);
    return parts.join(' + ');
  }, [attackers.length, tanks.length, healers.length, isRaid]);

  return (
    <div className="flex flex-col gap-2 p-3 pt-0">
      {team.length > 0 && (
        <div className="rounded-xl border-2 border-amber-500 bg-gray-800 p-2.5">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <span aria-hidden="true">⚔</span>
            <span>推薦隊伍組合</span>
            <span className="ml-auto font-normal text-amber-300">{teamLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {team.map(c => (
              <CounterItem key={`team-${c.pokemon_id}-${c.role}`} counter={c} compact />
            ))}
          </div>
        </div>
      )}

      {attackers.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-red-400">
            <span>攻擊手</span>
            <span className="font-normal text-gray-400">({attackers.length})</span>
          </div>
          <div className="flex flex-col gap-1">
            {attackers.map((c, i) => (
              <CounterItem key={`atk-${c.pokemon_id}-${c.fast_move.name}`} counter={c} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {!isRaid && tanks.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-blue-400">
            <span>坦克</span>
            <span className="font-normal text-gray-400">({tanks.length})</span>
          </div>
          <div className="flex flex-col gap-1">
            {tanks.map((c, i) => (
              <CounterItem key={`tank-${c.pokemon_id}-${c.fast_move.name}`} counter={c} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {!isRaid && healers.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-green-400">
            <span>補師</span>
            <span className="font-normal text-gray-400">({healers.length})</span>
          </div>
          <div className="flex flex-col gap-1">
            {healers.map((c, i) => (
              <CounterItem key={`heal-${c.pokemon_id}-${c.fast_move.name}`} counter={c} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
