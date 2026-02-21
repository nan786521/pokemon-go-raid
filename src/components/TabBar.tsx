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
  return (
    <>
      {/* Mobile/Tablet: bottom tab bar */}
      <nav className="fixed bottom-0 left-0 z-30 w-full border-t border-gray-700 bg-gray-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="分類導覽">
        <div className="mx-auto flex max-w-5xl" role="tablist">
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              aria-label={t.label}
              onClick={() => onChange(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                active === t.key
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop: horizontal top tabs */}
      <nav className="sticky top-[52px] z-25 hidden border-b border-gray-700 bg-gray-900/95 backdrop-blur lg:block" aria-label="分類導覽">
        <div className="mx-auto flex max-w-5xl gap-1 px-3 py-1" role="tablist">
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              onClick={() => onChange(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                active === t.key
                  ? 'bg-red-500/15 text-red-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
