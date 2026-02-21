import { useEffect, useRef, useState } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { CounterList } from './CounterList';
import { getOfficialArtUrl, getSpriteUrl } from '../utils/pokemon';

interface Props {
  boss: Boss | null;
  onClose: () => void;
}

function TierLabel({ boss }: { boss: Boss }) {
  if (boss.category === 'dynamax') return <span className="text-xs font-bold text-orange-500">極巨化</span>;
  if (boss.category === 'gigantamax') return <span className="text-xs font-bold text-purple-500">超極巨化</span>;
  return <span className="text-xs font-bold text-yellow-600">{'★'.repeat(typeof boss.tier === 'number' ? boss.tier : 5)}</span>;
}

export function BottomSheet({ boss, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Animate in when boss changes
  useEffect(() => {
    if (boss) {
      setImgError(false);
      // Trigger slide-up on next frame
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [boss]);

  // Close on Escape
  useEffect(() => {
    if (!boss) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [boss, onClose]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300); // Wait for slide-down animation
  }

  if (!boss) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={boss.name['zh-TW']}
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-gray-900 pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-600" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>

        {/* Boss header */}
        <div className="flex items-start gap-3 px-4 pb-3">
          <div className="relative h-20 w-20 shrink-0">
            <img
              src={imgError ? getSpriteUrl(boss.pokemon_id) : getOfficialArtUrl(boss.pokemon_id)}
              alt={boss.name['zh-TW']}
              className="h-20 w-20 object-contain"
              onError={() => setImgError(true)}
            />
            {boss.current && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <RecommendBadge level={boss.recommendation} />
              <TierLabel boss={boss} />
            </div>

            <h2 className="mt-1 text-lg font-bold text-white">
              {boss.name['zh-TW']}
              <span className="ml-1.5 text-sm font-normal text-gray-400">{boss.name.en}</span>
            </h2>

            <div className="mt-1 flex flex-wrap gap-1">
              {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span>CP {boss.cp_range.min}~{boss.cp_range.max}</span>
              <span className="text-gray-600">|</span>
              <span>{boss.solo_possible ? 'Solo 可行' : `需 ${boss.min_trainers}+ 人`}</span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-xs text-gray-400">弱點：</span>
              {boss.weaknesses.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="px-4 text-xs leading-relaxed text-gray-300">
          <span className="font-bold text-gray-100">推薦理由：</span>
          {boss.rec_reason}
        </div>

        {/* Ratings */}
        <div className="flex gap-4 px-4 pt-2 text-xs">
          <span className="text-gray-400">
            PVE {'★'.repeat(boss.pve_rating)}{'☆'.repeat(5 - boss.pve_rating)}
          </span>
          <span className="text-gray-400">
            PVP {'★'.repeat(boss.pvp_rating)}{'☆'.repeat(5 - boss.pvp_rating)}
          </span>
        </div>

        {/* Counter list */}
        <div className="mt-3 pb-6">
          <CounterList counters={boss.counters} category={boss.category} />
        </div>
      </div>
    </div>
  );
}
