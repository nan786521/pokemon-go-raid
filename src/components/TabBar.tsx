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
    <nav className="fixed bottom-0 left-0 z-30 w-full border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-5xl">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition ${
              active === t.key
                ? 'text-red-500'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
