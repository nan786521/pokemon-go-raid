import { useState, useMemo, useRef, useCallback, useEffect, lazy, Suspense } from 'react';
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
import { SortDropdown } from './components/SortDropdown';
import type { SortKey } from './components/SortDropdown';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { useFavorites } from './hooks/useFavorites';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';

// Lazy-loaded modals
const BottomSheet = lazy(() => import('./components/BottomSheet').then(m => ({ default: m.BottomSheet })));
const TypeCalculator = lazy(() => import('./components/TypeCalculator').then(m => ({ default: m.TypeCalculator })));
const RaidCalendar = lazy(() => import('./components/RaidCalendar').then(m => ({ default: m.RaidCalendar })));
const CompareModal = lazy(() => import('./components/CompareModal').then(m => ({ default: m.CompareModal })));
const RaidEstimator = lazy(() => import('./components/RaidEstimator').then(m => ({ default: m.RaidEstimator })));

// Valid values for URL params
const VALID_TABS = new Set<string>(['all', 'raid', 'dynamax', 'gigantamax']);
const VALID_SORTS = new Set<string>(['recommend', 'cp-desc', 'cp-asc', 'tier-desc', 'name']);

function getParams() {
  const p = new URLSearchParams(location.hash.slice(1));
  const tab = p.get('tab') || 'all';
  const sort = p.get('sort') || 'recommend';
  return {
    tab: (VALID_TABS.has(tab) ? tab : 'all') as Category | 'all',
    star: p.get('star') ? Number(p.get('star')) : null,
    type: (p.get('type') || null) as PokemonType | null,
    q: p.get('q') || '',
    current: p.get('current') === '1',
    sort: (VALID_SORTS.has(sort) ? sort : 'recommend') as SortKey,
  };
}

function setParams(state: { tab: string; star: number | null; type: string | null; q: string; current: boolean; sort: string }) {
  const p = new URLSearchParams();
  if (state.tab !== 'all') p.set('tab', state.tab);
  if (state.star !== null) p.set('star', String(state.star));
  if (state.type) p.set('type', state.type);
  if (state.q) p.set('q', state.q);
  if (state.current) p.set('current', '1');
  if (state.sort !== 'recommend') p.set('sort', state.sort);
  const hash = p.toString();
  history.replaceState(null, '', hash ? `#${hash}` : location.pathname);
}

// Loading fallback for lazy-loaded modals
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-red-500" />
    </div>
  );
}

function App() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  const init = getParams();
  const [activeTab, setActiveTab] = useState<Category | 'all'>(init.tab);
  const [starFilter, setStarFilter] = useState<number | null>(init.star);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(init.type);
  const [query, setQuery] = useState(init.q);
  const [currentOnly, setCurrentOnly] = useState(init.current);
  const [sortKey, setSortKey] = useState<SortKey>(init.sort);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showEstimator, setShowEstimator] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { favorites, isFavorite, toggle: toggleFavorite } = useFavorites();
  const { add: addRecent } = useRecentlyViewed();

  // Sync state → URL
  useEffect(() => {
    setParams({ tab: activeTab, star: starFilter, type: typeFilter, q: query, current: currentOnly, sort: sortKey });
  }, [activeTab, starFilter, typeFilter, query, currentOnly, sortKey]);

  // Dynamic document title
  useEffect(() => {
    if (selectedBoss) {
      document.title = `${selectedBoss.name['zh-TW']} 反制推薦 — POGO Raid`;
    } else {
      document.title = 'POGO 團體戰推薦隊伍';
    }
  }, [selectedBoss]);

  const currentBosses = useMemo(() => bosses.filter(b => b.current), []);

  const availableTiers = useMemo(() => {
    const filtered = activeTab === 'all' ? bosses : bosses.filter(b => b.category === activeTab);
    return [...new Set(filtered.map(b => b.tier))];
  }, [activeTab]);

  // Filtered + sorted boss list (depends on favorites for sort order)
  const filtered = useMemo(() => {
    let list = [...bosses];

    if (activeTab !== 'all') list = list.filter(b => b.category === activeTab);
    if (currentOnly) list = list.filter(b => b.current);
    if (starFilter !== null) list = list.filter(b => b.tier === starFilter);
    if (typeFilter !== null) list = list.filter(b => b.types.includes(typeFilter));
    if (query) list = list.filter(b => matchesBoss(b, query));

    list.sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1;
      const aFav = favorites.has(a.id);
      const bFav = favorites.has(b.id);
      if (aFav !== bFav) return aFav ? -1 : 1;

      switch (sortKey) {
        case 'cp-desc': return b.cp_range.max - a.cp_range.max;
        case 'cp-asc': return a.cp_range.max - b.cp_range.max;
        case 'tier-desc': {
          const at = typeof a.tier === 'number' ? a.tier : 6;
          const bt = typeof b.tier === 'number' ? b.tier : 6;
          return bt - at;
        }
        case 'name': return a.name['zh-TW'].localeCompare(b.name['zh-TW'], 'zh-TW');
        default: return RECOMMEND_ORDER.indexOf(a.recommendation) - RECOMMEND_ORDER.indexOf(b.recommendation);
      }
    });

    return list;
  }, [activeTab, starFilter, typeFilter, query, currentOnly, sortKey, favorites]);

  const scrollToBoss = useCallback((bossId: string) => {
    const el = document.getElementById(`boss-${bossId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSelectBoss = useCallback((boss: Boss) => {
    setSelectedBoss(boss);
    addRecent(boss.id);
  }, [addRecent]);

  // Stable modal close callbacks
  const closeBottomSheet = useCallback(() => setSelectedBoss(null), []);
  const closeCalculator = useCallback(() => setShowCalculator(false), []);
  const closeCalendar = useCallback(() => setShowCalendar(false), []);
  const closeCompare = useCallback(() => setShowCompare(false), []);
  const closeEstimator = useCallback(() => setShowEstimator(false), []);
  const openCalculator = useCallback(() => setShowCalculator(true), []);
  const openCalendar = useCallback(() => setShowCalendar(true), []);
  const openCompare = useCallback(() => setShowCompare(true), []);
  const openEstimator = useCallback(() => setShowEstimator(true), []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header
        query={query}
        onQueryChange={setQuery}
        allBosses={bosses}
        onSelectBoss={handleSelectBoss}
        onOpenCalendar={openCalendar}
        onOpenCalculator={openCalculator}
        onOpenCompare={openCompare}
        onOpenEstimator={openEstimator}
      />
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Filters */}
      <div className="sticky top-[52px] z-20 space-y-2 bg-gray-900/90 px-3 py-2 backdrop-blur lg:top-[96px]">
        <div className="flex items-center gap-2">
          {currentBosses.length > 0 && (
            <button
              onClick={() => setCurrentOnly(v => !v)}
              aria-pressed={currentOnly}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                currentOnly
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {currentOnly ? '● 當前輪替' : '○ 當前輪替'}
            </button>
          )}
          {activeTab === 'raid' && (
            <StarFilter selected={starFilter} onChange={setStarFilter} availableTiers={availableTiers} />
          )}
          <div className="ml-auto">
            <SortDropdown value={sortKey} onChange={setSortKey} />
          </div>
        </div>
        <TypeFilter selected={typeFilter} onChange={setTypeFilter} />
      </div>

      {/* Mobile tool buttons */}
      <div className="flex flex-wrap gap-2 px-3 pt-2 sm:hidden">
        <button onClick={openCalculator} className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          屬性計算機
        </button>
        <button onClick={openCalendar} className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          團戰日曆
        </button>
        <button onClick={openCompare} className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          比較頭目
        </button>
        <button onClick={openEstimator} className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          難度評估
        </button>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-3 pb-24 lg:pb-6" ref={listRef}>
        {activeTab === 'all' && !query && !currentOnly && (
          <div className="mb-4 mt-2">
            <CurrentBossBanner bosses={currentBosses} onSelect={scrollToBoss} />
          </div>
        )}

        <div className="mb-3 mt-2 text-xs text-gray-400" aria-live="polite">
          顯示 {filtered.length} 隻頭目
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="頭目列表">
          {filtered.map(b => (
            <div key={b.id} id={`boss-${b.id}`} role="listitem">
              <BossCard
                boss={b}
                onSelect={handleSelectBoss}
                isFavorite={isFavorite(b.id)}
                onToggleFavorite={() => toggleFavorite(b.id)}
              />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <div className="text-4xl" aria-hidden="true">🔍</div>
            <div className="mt-2">找不到符合條件的頭目</div>
          </div>
        )}
      </main>

      {/* Lazy-loaded modals */}
      <Suspense fallback={<LoadingOverlay />}>
        {selectedBoss && <BottomSheet boss={selectedBoss} onClose={closeBottomSheet} />}
        {showCalculator && <TypeCalculator onClose={closeCalculator} />}
        {showCalendar && <RaidCalendar bosses={bosses} onClose={closeCalendar} onSelect={handleSelectBoss} />}
        {showCompare && <CompareModal bosses={bosses} onClose={closeCompare} />}
        {showEstimator && <RaidEstimator bosses={bosses} onClose={closeEstimator} />}
      </Suspense>

      <InstallPrompt />
      <UpdateNotification />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'POGO 團體戰推薦隊伍',
            description: 'Pokémon GO 團體戰推薦隊伍查詢工具 — 快速查詢頭目反制陣容、極巨化/超極巨化推薦組合',
            url: 'https://nan786521.github.io/pokemon-go-raid/',
            applicationCategory: 'GameApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
          }),
        }}
      />
    </div>
  );
}

export default App;
