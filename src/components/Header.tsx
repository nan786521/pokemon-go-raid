import { useState, useEffect, useRef } from 'react';
import type { Boss } from '../types';
import { matchesBoss } from '../utils/search';
import { SearchSuggestions } from './SearchSuggestions';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  allBosses: Boss[];
  onSelectBoss: (boss: Boss) => void;
  onOpenCalendar: () => void;
  onOpenCalculator: () => void;
  onOpenCompare: () => void;
  onOpenEstimator: () => void;
}

export function Header({ query, onQueryChange, allBosses, onSelectBoss, onOpenCalendar, onOpenCalculator, onOpenCompare, onOpenEstimator }: Props) {
  const [local, setLocal] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocal(query); }, [query]);

  function handleChange(value: string) {
    setLocal(value);
    setShowSuggestions(value.length > 0);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onQueryChange(value), 200);
  }

  function handleSelectSuggestion(boss: Boss) {
    setShowSuggestions(false);
    setLocal('');
    onQueryChange('');
    onSelectBoss(boss);
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Close suggestions on click outside
  useEffect(() => {
    if (!showSuggestions) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSuggestions]);

  const suggestions = local.length > 0
    ? allBosses.filter(b => matchesBoss(b, local)).slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-gray-900/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 lg:gap-4 lg:py-3">
        {/* Logo */}
        <h1 className="shrink-0 text-base font-extrabold text-red-500 sm:text-lg lg:text-xl">
          POGO Raid
        </h1>

        {/* Search */}
        <div className="relative flex-1 lg:max-w-md" ref={wrapperRef}>
          <input
            type="search"
            value={local}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => local.length > 0 && setShowSuggestions(true)}
            placeholder="搜尋頭目（中/英/日/暱稱）"
            aria-label="搜尋頭目"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-autocomplete="list"
            className="w-full rounded-full border border-gray-600 bg-gray-800 py-2 pr-3 pl-9 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-900"
          />
          <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSelectSuggestion}
            visible={showSuggestions}
          />
        </div>

        {/* Tool buttons */}
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={onOpenCalculator}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="屬性計算機"
            title="屬性計算機"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={onOpenCalendar}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="團戰日曆"
            title="團戰日曆"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={onOpenCompare}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="比較頭目"
            title="比較頭目"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={onOpenEstimator}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="難度評估"
            title="難度評估"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
