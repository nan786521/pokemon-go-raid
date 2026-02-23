import { memo, useState, useEffect } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { TierLabel } from './TierLabel';
import { FavoriteButton } from './FavoriteButton';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { getOfficialArtUrl, getSpriteUrl } from '../utils/pokemon';

interface Props {
  boss: Boss;
  onSelect: (boss: Boss) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const Countdown = memo(function Countdown({ end }: { end: string }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!end) return null;
  const diff = new Date(end).getTime() - now;
  if (diff <= 0) return <span className="text-xs text-red-400">已結束</span>;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return <span className="text-xs font-medium text-emerald-400">剩餘 {days}天{hours}時</span>;
});

export const BossCard = memo(function BossCard({ boss, onSelect, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className="relative">
      <button
        onClick={() => onSelect(boss)}
        className="w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-800 text-left shadow-sm transition hover:bg-gray-750 hover:shadow-md active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-gray-900"
      >
        <div className="flex items-start gap-3 p-3 lg:gap-4 lg:p-4">
          {/* Pokemon Image */}
          <div className="relative h-16 w-16 shrink-0 lg:h-20 lg:w-20">
            <ImageWithSkeleton
              src={getOfficialArtUrl(boss.pokemon_id)}
              fallbackSrc={getSpriteUrl(boss.pokemon_id)}
              alt={boss.name['zh-TW']}
              loading="lazy"
              className="h-16 w-16 object-contain lg:h-20 lg:w-20"
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

            <h3 className="mt-1 text-base font-bold text-white">
              {boss.name['zh-TW']}
              <span className="ml-1.5 text-xs font-normal text-gray-400">{boss.name.en}</span>
            </h3>

            <div className="mt-1 flex flex-wrap gap-1">
              {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span>CP {boss.cp_range.min}~{boss.cp_range.max}</span>
              <span className="text-gray-600">|</span>
              <span>{boss.solo_possible ? 'Solo 可行' : `需 ${boss.min_trainers}+ 人`}</span>
              {boss.current && <Countdown end={boss.rotation_end} />}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-xs text-gray-400">弱點：</span>
              {boss.weaknesses.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>
          </div>
        </div>
      </button>
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </div>
  );
});
