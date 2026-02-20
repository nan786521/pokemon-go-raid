import { useState } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { CounterList } from './CounterList';
import { getOfficialArtUrl, getSpriteUrl } from '../utils/pokemon';

interface Props {
  boss: Boss;
}

function TierLabel({ boss }: { boss: Boss }) {
  if (boss.category === 'dynamax') {
    return <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">極巨化</span>;
  }
  if (boss.category === 'gigantamax') {
    return <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">超極巨化</span>;
  }
  const tier = typeof boss.tier === 'number' ? boss.tier : 5;
  return <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">{'★'.repeat(tier)}</span>;
}

function Countdown({ end }: { end: string }) {
  if (!end) return null;
  const endDate = new Date(end);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/50 dark:text-red-300">已結束</span>;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">剩餘 {days}天{hours}時</span>;
}

export function BossCard({ boss }: Props) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Card Header - clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-[11rem] items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700/50 dark:active:bg-gray-700"
      >
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

          <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-gray-50">
            {boss.name['zh-TW']}
            <span className="ml-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">{boss.name.en}</span>
          </h3>

          {/* Types */}
          <div className="mt-1 flex flex-wrap gap-1">
            {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>

          {/* Meta info row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>CP {boss.cp_range.min}~{boss.cp_range.max}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span>{boss.solo_possible ? 'Solo 可行' : `需 ${boss.min_trainers}+ 人`}</span>
            {boss.current && <Countdown end={boss.rotation_end} />}
          </div>

          {/* Weaknesses */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">弱點：</span>
            {boss.weaknesses.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>
        </div>

        {/* Expand indicator */}
        <span className={`mt-2 shrink-0 text-sm text-gray-400 transition-transform dark:text-gray-500 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
          {/* Reason */}
          <div className="px-3 pt-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100">推薦理由：</span>
            {boss.rec_reason}
          </div>

          {/* Ratings */}
          <div className="flex gap-4 px-3 pt-2 text-xs">
            <span className="text-yellow-600 dark:text-yellow-400">
              PVE {'★'.repeat(boss.pve_rating)}{'☆'.repeat(5 - boss.pve_rating)}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              PVP {'★'.repeat(boss.pvp_rating)}{'☆'.repeat(5 - boss.pvp_rating)}
            </span>
          </div>

          {/* Counter list */}
          <div className="mt-2">
            <CounterList counters={boss.counters} />
          </div>
        </div>
      )}
    </div>
  );
}
