import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { Boss, Category, PokemonType } from './types';
import { bosses } from './data/bosses';
import { matchesBoss } from './utils/search';
import { RECOMMEND_ORDER } from './utils/recommend';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { StarFilter } from './components/StarFilter';
import { TypeFilter } from './components/TypeFilter';
import { BossCard } from './components/BossCard';
import { CurrentBossBanner } from './components/CurrentBossBanner';
import { BottomSheet } from './components/BottomSheet';

// --- URL query param helpers ---
function getParams() {
  const p = new URLSearchParams(location.hash.slice(1));
  return {
    tab: (p.get('tab') || 'all') as Category | 'all',
    star: p.get('star') ? Number(p.get('star')) : null,
    type: (p.get('type') || null) as PokemonType | null,
    q: p.get('q') || '',
    current: p.get('current') === '1',
  };
}

function setParams(state: { tab: string; star: number | null; type: string | null; q: string; current: boolean }) {
  const p = new URLSearchParams();
  if (state.tab !== 'all') p.set('tab', state.tab);
  if (state.star !== null) p.set('star', String(state.star));
  if (state.type) p.set('type', state.type);
  if (state.q) p.set('q', state.q);
  if (state.current) p.set('current', '1');
  const hash = p.toString();
  history.replaceState(null, '', hash ? `#${hash}` : location.pathname);
}

function App() {
  // Always dark mode
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  const init = getParams();
  const [activeTab, setActiveTab] = useState<Category | 'all'>(init.tab);
  const [starFilter, setStarFilter] = useState<number | null>(init.star);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(init.type);
  const [query, setQuery] = useState(init.q);
  const [currentOnly, setCurrentOnly] = useState(init.current);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync state → URL
  useEffect(() => {
    setParams({ tab: activeTab, star: starFilter, type: typeFilter, q: query, current: currentOnly });
  }, [activeTab, starFilter, typeFilter, query, currentOnly]);

  // Current bosses
  const currentBosses = useMemo(() => bosses.filter(b => b.current), []);

  // Available star tiers for current tab
  const availableTiers = useMemo(() => {
    const filtered = activeTab === 'all' ? bosses : bosses.filter(b => b.category === activeTab);
    return [...new Set(filtered.map(b => b.tier))];
  }, [activeTab]);

  // Filtered boss list
  const filtered = useMemo(() => {
    let list = [...bosses];

    // Tab filter
    if (activeTab !== 'all') {
      list = list.filter(b => b.category === activeTab);
    }

    // Current only
    if (currentOnly) {
      list = list.filter(b => b.current);
    }

    // Star filter
    if (starFilter !== null) {
      list = list.filter(b => b.tier === starFilter);
    }

    // Type filter
    if (typeFilter !== null) {
      list = list.filter(b => b.types.includes(typeFilter));
    }

    // Search
    if (query) {
      list = list.filter(b => matchesBoss(b, query));
    }

    // Sort: current first, then by recommendation rank
    list.sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1;
      return RECOMMEND_ORDER.indexOf(a.recommendation) - RECOMMEND_ORDER.indexOf(b.recommendation);
    });

    return list;
  }, [activeTab, starFilter, typeFilter, query, currentOnly]);

  const scrollToBoss = useCallback((bossId: string) => {
    const el = document.getElementById(`boss-${bossId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header query={query} onQueryChange={setQuery} />

      {/* Filters */}
      <div className="sticky top-[52px] z-20 space-y-2 bg-gray-50/90 px-3 py-2 backdrop-blur dark:bg-gray-900/90">
        <div className="flex items-center gap-2">
          {/* Current only toggle */}
          {currentBosses.length > 0 && (
            <button
              onClick={() => setCurrentOnly(v => !v)}
              aria-pressed={currentOnly}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                currentOnly
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {currentOnly ? '● 當前輪替' : '○ 當前輪替'}
            </button>
          )}
          {activeTab === 'raid' && (
            <StarFilter selected={starFilter} onChange={setStarFilter} availableTiers={availableTiers} />
          )}
        </div>
        <TypeFilter selected={typeFilter} onChange={setTypeFilter} />
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-3 pb-24" ref={listRef}>
        {/* Current boss banner */}
        {activeTab === 'all' && !query && !currentOnly && (
          <div className="mb-4">
            <CurrentBossBanner bosses={currentBosses} onSelect={scrollToBoss} />
          </div>
        )}

        {/* Boss count */}
        <div className="mb-3 text-xs text-gray-400">
          顯示 {filtered.length} 隻頭目
        </div>

        {/* Boss grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(b => (
            <div key={b.id} id={`boss-${b.id}`}>
              <BossCard boss={b} onSelect={setSelectedBoss} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <div className="text-4xl">🔍</div>
            <div className="mt-2">找不到符合條件的頭目</div>
          </div>
        )}
      </main>

      <TabBar active={activeTab} onChange={setActiveTab} />
      <BottomSheet boss={selectedBoss} onClose={() => setSelectedBoss(null)} />
    </div>
  );
}

export default App;
