import type { PokemonType } from '../types';
import { TYPE_COLORS, ALL_TYPES } from '../utils/typeColors';

interface Props {
  selected: PokemonType | null;
  onChange: (type: PokemonType | null) => void;
}

export function TypeFilter({ selected, onChange }: Props) {
  return (
    <div className="relative" role="group" aria-label="屬性篩選">
      {/* Mobile: horizontal scroll with fade hint */}
      <div className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        <button
          onClick={() => onChange(null)}
          aria-pressed={selected === null}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition md:shrink ${
            selected === null
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          全屬性
        </button>
        {ALL_TYPES.map(t => {
          const info = TYPE_COLORS[t];
          const active = selected === t;
          return (
            <button
              key={t}
              onClick={() => onChange(active ? null : t)}
              aria-pressed={active}
              aria-label={info.label}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition md:shrink"
              style={{
                backgroundColor: active ? info.bg : undefined,
                color: active ? info.text : info.bg,
                border: active ? 'none' : `1.5px solid ${info.bg}`,
              }}
            >
              {info.label}
            </button>
          );
        })}
      </div>
      {/* Fade hint for scroll on mobile */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-900 to-transparent md:hidden" />
    </div>
  );
}
