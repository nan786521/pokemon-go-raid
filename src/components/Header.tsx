import { useState, useEffect, useRef } from 'react';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
}

export function Header({ query, onQueryChange }: Props) {
  const [local, setLocal] = useState(query);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setLocal(query); }, [query]);

  function handleChange(value: string) {
    setLocal(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onQueryChange(value), 200);
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <header className="sticky top-0 z-30 bg-gray-900/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2">
        {/* Logo */}
        <h1 className="shrink-0 text-base font-extrabold text-red-500 sm:text-lg">
          POGO Raid
        </h1>

        {/* Search */}
        <div className="relative flex-1">
          <input
            type="search"
            value={local}
            onChange={e => handleChange(e.target.value)}
            placeholder="搜尋頭目（中/英/日/暱稱）"
            aria-label="搜尋頭目"
            className="w-full rounded-full border border-gray-600 bg-gray-800 py-1.5 pr-3 pl-9 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-900"
          />
          <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
