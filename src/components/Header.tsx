interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export function Header({ query, onQueryChange, dark, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 shadow-sm backdrop-blur dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2">
        {/* Logo */}
        <h1 className="shrink-0 text-base font-extrabold text-red-500 sm:text-lg">
          POGO Raid
        </h1>

        {/* Search */}
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="搜尋頭目（中/英/日/暱稱）"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 pr-3 pl-9 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-red-900"
          />
          <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="shrink-0 rounded-full p-2 text-lg transition hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="切換深色模式"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
