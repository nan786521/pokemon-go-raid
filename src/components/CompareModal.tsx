import { useState, useMemo, memo } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { RatingStars } from './RatingStars';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  bosses: Boss[];
  onClose: () => void;
}

const BossColumn = memo(function BossColumn({ boss }: { boss: Boss | null }) {
  if (!boss) return <div className="flex-1 p-4 text-center text-gray-500">選擇頭目</div>;

  const topCounters = useMemo(
    () => boss.counters.filter(c => c.role === 'attacker').sort((a, b) => b.dps - a.dps).slice(0, 3),
    [boss.counters]
  );

  return (
    <div className="flex-1 min-w-0 p-3">
      <div className="flex flex-col items-center gap-1">
        <img src={getSpriteUrl(boss.pokemon_id)} alt="" className="h-14 w-14" style={{ imageRendering: 'pixelated' }} />
        <div className="text-sm font-bold text-white text-center">{boss.name['zh-TW']}</div>
        <RecommendBadge level={boss.recommendation} />
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <div className="flex flex-wrap gap-1 justify-center">
          {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
        </div>
        <div className="text-center text-gray-300">CP {boss.cp_range.min}~{boss.cp_range.max}</div>
        <div className="text-center text-gray-400">{boss.solo_possible ? 'Solo 可行' : `需 ${boss.min_trainers}+ 人`}</div>
        <div className="text-center"><RatingStars label="PVE" rating={boss.pve_rating} /></div>
        <div className="text-center"><RatingStars label="PVP" rating={boss.pvp_rating} /></div>

        <div className="mt-2">
          <div className="mb-1 text-xs font-bold text-gray-400 text-center">弱點</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {boss.weaknesses.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>
        </div>

        <div className="mt-2">
          <div className="mb-1 text-xs font-bold text-gray-400 text-center">Top 反制</div>
          {topCounters.map(c => (
            <div key={c.pokemon_id} className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 mb-1">
              <img src={getSpriteUrl(c.pokemon_id)} alt="" className="h-5 w-5" style={{ imageRendering: 'pixelated' }} />
              <span className="truncate text-gray-200">{c.name['zh-TW']}</span>
              <span className="ml-auto text-red-400">{c.dps.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export function CompareModal({ bosses, onClose }: Props) {
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');

  const left = useMemo(() => bosses.find(b => b.id === leftId) ?? null, [bosses, leftId]);
  const right = useMemo(() => bosses.find(b => b.id === rightId) ?? null, [bosses, rightId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmp-title"
        className="relative w-full max-w-lg overflow-y-auto rounded-2xl bg-gray-900 shadow-2xl max-h-[90vh]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-900 px-4 pt-4 pb-2">
          <h2 id="cmp-title" className="text-lg font-bold text-white">比較頭目</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800" aria-label="關閉">✕</button>
        </div>

        <div className="flex gap-2 px-4 pb-3">
          <select value={leftId} onChange={e => setLeftId(e.target.value)} aria-label="選擇頭目 A" className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-xs text-gray-200">
            <option value="">選擇頭目 A</option>
            {bosses.map(b => <option key={b.id} value={b.id}>{b.name['zh-TW']}</option>)}
          </select>
          <span className="self-center text-gray-500 text-sm" aria-hidden="true">VS</span>
          <select value={rightId} onChange={e => setRightId(e.target.value)} aria-label="選擇頭目 B" className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-xs text-gray-200">
            <option value="">選擇頭目 B</option>
            {bosses.map(b => <option key={b.id} value={b.id}>{b.name['zh-TW']}</option>)}
          </select>
        </div>

        <div className="flex divide-x divide-gray-700 pb-4">
          <BossColumn boss={left} />
          <BossColumn boss={right} />
        </div>
      </div>
    </div>
  );
}
