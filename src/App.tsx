import { useState, useMemo, useRef } from 'react';
import type { Category, PokemonType } from './types';
import { bosses } from './data/bosses';
import { matchesBoss } from './utils/search';
import { RECOMMEND_ORDER } from './utils/recommend';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { StarFilter } from './components/StarFilter';
import { TypeFilter } from './components/TypeFilter';
import { BossCard } from './components/BossCard';
import { CurrentBossBanner } from './components/CurrentBossBanner';

function App() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState<Category | 'all'>('all');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

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
  }, [activeTab, starFilter, typeFilter, query]);

  function scrollToBoss(bossId: string) {
    const el = document.getElementById(`boss-${bossId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header query={query} onQueryChange={setQuery} dark={dark} onToggleTheme={toggle} />

      {/* Filters */}
      <div className="sticky top-[52px] z-20 space-y-2 bg-gray-50/90 px-3 py-2 backdrop-blur dark:bg-gray-900/90">
        {activeTab === 'raid' && (
          <StarFilter selected={starFilter} onChange={setStarFilter} availableTiers={availableTiers} />
        )}
        <TypeFilter selected={typeFilter} onChange={setTypeFilter} />
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-3 pb-24" ref={listRef}>
        {/* Current boss banner */}
        {activeTab === 'all' && !query && (
          <div className="mb-4">
            <CurrentBossBanner bosses={currentBosses} onSelect={scrollToBoss} />
          </div>
        )}

        {/* Boss count */}
        <div className="mb-3 text-xs text-gray-400">
          顯示 {filtered.length} 隻頭目
        </div>

        {/* Boss grid */}
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(b => (
            <div key={b.id} id={`boss-${b.id}`}>
              <BossCard boss={b} />
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
    </div>
  );
}

export default App;
