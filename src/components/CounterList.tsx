import type { Counter } from '../types';
import { CounterItem } from './CounterItem';

interface Props {
  counters: Counter[];
}

export function CounterList({ counters }: Props) {
  const attackers = counters.filter(c => c.role === 'attacker').sort((a, b) => b.dps - a.dps);
  const tanks = counters.filter(c => c.role === 'tank').sort((a, b) => b.dps - a.dps);
  const healers = counters.filter(c => c.role === 'healer').sort((a, b) => b.dps - a.dps);

  // Build recommended team: 2 tanks + 1 best attacker (+ healer if available)
  const teamTanks = tanks.slice(0, 2);
  const teamAttacker = attackers[0];
  const teamHealer = healers[0];
  const hasTeam = teamTanks.length >= 1 && teamAttacker;

  return (
    <div className="flex flex-col gap-2 p-3 pt-0">
      {/* Recommended team composition */}
      {hasTeam && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 dark:border-amber-700/50 dark:bg-amber-900/20">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <span>⚔</span>
            <span>推薦隊伍組合</span>
            <span className="ml-auto font-normal text-amber-600/70 dark:text-amber-400/60">
              {teamTanks.length}坦 + 1打{teamHealer ? ' + 1補' : ''}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {teamTanks.map(c => (
              <CounterItem key={`team-${c.pokemon_id}`} counter={c} compact />
            ))}
            <CounterItem key={`team-${teamAttacker.pokemon_id}`} counter={teamAttacker} compact />
            {teamHealer && (
              <CounterItem key={`team-${teamHealer.pokemon_id}`} counter={teamHealer} compact />
            )}
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

      {tanks.length > 0 && (
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

      {healers.length > 0 && (
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
