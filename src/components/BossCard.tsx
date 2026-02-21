import { useState, memo } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { getOfficialArtUrl, getSpriteUrl } from '../utils/pokemon';

interface Props {
  boss: Boss;
  onSelect: (boss: Boss) => void;
}

function TierLabel({ boss }: { boss: Boss }) {
  if (boss.category === 'dynamax') return <span className="text-xs font-bold text-orange-500">極巨化</span>;
  if (boss.category === 'gigantamax') return <span className="text-xs font-bold text-purple-500">超極巨化</span>;
  return <span className="text-xs font-bold text-yellow-600">{'★'.repeat(typeof boss.tier === 'number' ? boss.tier : 5)}</span>;
}

function Countdown({ end }: { end: string }) {
  if (!end) return null;
  const endDate = new Date(end);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return <span className="text-xs text-red-400">已結束</span>;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return <span className="text-xs text-emerald-500">剩餘 {days}天{hours}時</span>;
}

export const BossCard = memo(function BossCard({ boss, onSelect }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onSelect(boss)}
      className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 dark:active:bg-gray-700"
    >
      <div className="flex items-start gap-3 p-3">
        {/* Pokemon Image */}
        <div className="relative h-16 w-16 shrink-0">
          <img
            src={imgError ? getSpriteUrl(boss.pokemon_id) : getOfficialArtUrl(boss.pokemon_id)}
            alt={boss.name['zh-TW']}
            loading="lazy"
            className="h-16 w-16 object-contain"
            onError={() => setImgError(true)}
          />
          {boss.current && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <RecommendBadge level={boss.recommendation} />
            <TierLabel boss={boss} />
          </div>

          <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-white">
            {boss.name['zh-TW']}
            <span className="ml-1.5 text-xs font-normal text-gray-400">{boss.name.en}</span>
          </h3>

          {/* Types */}
          <div className="mt-1 flex flex-wrap gap-1">
            {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>

          {/* Meta info row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>CP {boss.cp_range.min}~{boss.cp_range.max}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span>{boss.solo_possible ? 'Solo 可行' : `需 ${boss.min_trainers}+ 人`}</span>
            {boss.current && <Countdown end={boss.rotation_end} />}
          </div>

          {/* Weaknesses */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span className="text-xs text-gray-400">弱點：</span>
            {boss.weaknesses.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>
        </div>
      </div>
    </button>
  );
});
