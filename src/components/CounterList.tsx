import type { Counter, Category } from '../types';
import { CounterItem } from './CounterItem';

interface Props {
  counters: Counter[];
  category: Category;
}

export function CounterList({ counters, category }: Props) {
  const attackers = counters.filter(c => c.role === 'attacker').sort((a, b) => b.dps - a.dps);
  const tanks = counters.filter(c => c.role === 'tank').sort((a, b) => b.dps - a.dps);
  const healers = counters.filter(c => c.role === 'healer').sort((a, b) => b.dps - a.dps);

  // Raid bosses: attackers only; Dynamax/Gigantamax: all roles
  const isRaid = category === 'raid';
  const team = isRaid ? [...attackers] : [...attackers, ...tanks, ...healers];
  const hasTeam = team.length > 0;
  const atkCount = attackers.length;
  const tankCount = isRaid ? 0 : tanks.length;
  const healCount = isRaid ? 0 : healers.length;
  const teamLabel = [
    atkCount > 0 ? `${atkCount}打` : '',
    tankCount > 0 ? `${tankCount}坦` : '',
    healCount > 0 ? `${healCount}補` : '',
  ].filter(Boolean).join(' + ');

  return (
    <div className="flex flex-col gap-2 p-3 pt-0">
      {/* Recommended team composition */}
      {hasTeam && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-2.5 dark:border-amber-500 dark:bg-gray-800">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
            <span>⚔</span>
            <span>推薦隊伍組合</span>
            <span className="ml-auto font-normal text-amber-700 dark:text-amber-300">
              {teamLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {team.map(c => (
              <CounterItem key={`team-${c.pokemon_id}-${c.role}`} counter={c} compact />
            ))}
          </div>
        </div>
      )}

      {/* Grouped counter list */}
      {attackers.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
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
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
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
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
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
}
