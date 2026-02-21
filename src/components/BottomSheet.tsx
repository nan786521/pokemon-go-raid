import { useEffect, useRef, useState, useCallback } from 'react';
import type { Boss } from '../types';
import { TypeBadge } from './TypeBadge';
import { RecommendBadge } from './RecommendBadge';
import { TierLabel } from './TierLabel';
import { RatingStars } from './RatingStars';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { CounterList } from './CounterList';
import { getOfficialArtUrl, getSpriteUrl } from '../utils/pokemon';

interface Props {
  boss: Boss | null;
  onClose: () => void;
}

export function BottomSheet({ boss, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Swipe-to-close state
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const isDragging = useRef(false);

  // Open animation + focus management
  useEffect(() => {
    if (boss) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
      // Focus after transition completes
      const timer = setTimeout(() => panelRef.current?.focus(), 310);
      return () => { clearTimeout(timer); document.body.style.overflow = ''; };
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      return () => { document.body.style.overflow = ''; };
    }
  }, [boss]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      previousFocusRef.current?.focus();
    }, 300);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!boss) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [boss, handleClose]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  // Swipe-to-close handlers (mobile)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const panel = panelRef.current;
    if (!panel || panel.scrollTop > 5) return;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !panelRef.current) return;
    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchCurrentY.current - touchStartY.current;
    if (diff > 0) {
      panelRef.current.style.transform = `translateY(${diff}px)`;
      panelRef.current.style.transition = 'none';
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || !panelRef.current) return;
    isDragging.current = false;
    const diff = touchCurrentY.current - touchStartY.current;
    panelRef.current.style.transition = '';
    panelRef.current.style.transform = '';
    if (diff > 100) handleClose();
  }, [handleClose]);

  if (!boss) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bs-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={[
          'absolute overflow-y-auto bg-gray-900 shadow-2xl transition-transform duration-300 ease-out outline-none',
          'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl',
          'md:left-1/2 md:right-auto md:w-full md:max-w-2xl md:-translate-x-1/2',
          'lg:inset-y-0 lg:left-auto lg:right-0 lg:bottom-auto lg:w-[28rem] lg:max-w-none lg:max-h-none lg:translate-x-0 lg:-translate-x-0 lg:rounded-t-none lg:rounded-l-2xl',
          visible
            ? 'translate-y-0 lg:translate-x-0'
            : 'translate-y-full lg:translate-y-0 lg:translate-x-full',
        ].join(' ')}
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-gray-900 pt-3 pb-2 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-600" />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>

        <div className="hidden lg:block lg:h-4" />

        {/* Boss header */}
        <div className="flex items-start gap-4 px-4 pb-3">
          <div className="relative h-28 w-28 shrink-0">
            <ImageWithSkeleton
              src={getOfficialArtUrl(boss.pokemon_id)}
              fallbackSrc={getSpriteUrl(boss.pokemon_id)}
              alt={boss.name['zh-TW']}
              className="h-28 w-28 object-contain"
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

            <h2 id="bs-title" className="mt-1 text-lg font-bold text-white">
              {boss.name['zh-TW']}
              <span className="ml-1.5 text-sm font-normal text-gray-400">{boss.name.en}</span>
            </h2>

            <div className="mt-1 flex flex-wrap gap-1">
              {boss.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-300">
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

        <div className="px-4 text-xs leading-relaxed text-gray-300">
          <span className="font-bold text-gray-100">推薦理由：</span>
          {boss.rec_reason}
        </div>

        <div className="flex gap-4 px-4 pt-2 text-xs">
          <RatingStars label="PVE" rating={boss.pve_rating} />
          <RatingStars label="PVP" rating={boss.pvp_rating} />
        </div>

        <div className="mt-3 pb-6">
          <CounterList counters={boss.counters} category={boss.category} />
        </div>
      </div>
    </div>
  );
}
