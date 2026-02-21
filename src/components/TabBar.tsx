import { useCallback } from 'react';
import type { Category } from '../types';

interface Props {
  active: Category | 'all';
  onChange: (tab: Category | 'all') => void;
}

const tabs: { key: Category | 'all'; label: string; icon: string }[] = [
  { key: 'all',        label: '全部',   icon: '🏠' },
  { key: 'raid',       label: '道館',   icon: '⭐' },
  { key: 'dynamax',    label: '極巨化', icon: '🔴' },
  { key: 'gigantamax', label: '超極巨', icon: '💎' },
];

export function TabBar({ active, onChange }: Props) {
  // Keyboard navigation: Arrow Left/Right to switch tabs
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const idx = tabs.findIndex(t => t.key === active);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      onChange(next.key);
      // Focus the next tab button
      const target = (e.currentTarget as HTMLElement).querySelector(`[data-tab="${next.key}"]`) as HTMLElement;
      target?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      onChange(prev.key);
      const target = (e.currentTarget as HTMLElement).querySelector(`[data-tab="${prev.key}"]`) as HTMLElement;
      target?.focus();
    }
  }, [active, onChange]);

  return (
    <>
      {/* Mobile/Tablet: bottom tab bar */}
      <nav className="fixed bottom-0 left-0 z-30 w-full border-t border-gray-700 bg-gray-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="分類導覽">
        <div className="mx-auto flex max-w-5xl" role="tablist" onKeyDown={handleKeyDown}>
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              data-tab={t.key}
              aria-selected={active === t.key}
              aria-label={t.label}
              tabIndex={active === t.key ? 0 : -1}
              onClick={() => onChange(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                active === t.key
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop: horizontal top tabs */}
      <nav className="sticky top-[52px] z-25 hidden border-b border-gray-700 bg-gray-900/95 backdrop-blur lg:block" aria-label="分類導覽">
        <div className="mx-auto flex max-w-5xl gap-1 px-3 py-1" role="tablist" onKeyDown={handleKeyDown}>
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              data-tab={t.key}
              aria-selected={active === t.key}
              tabIndex={active === t.key ? 0 : -1}
              onClick={() => onChange(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                active === t.key
                  ? 'bg-red-500/15 text-red-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <span className="mr-1.5" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
