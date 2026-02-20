import type { PokemonType } from '../types';
import { TYPE_COLORS, ALL_TYPES } from '../utils/typeColors';

interface Props {
  selected: PokemonType | null;
  onChange: (type: PokemonType | null) => void;
}

export function TypeFilter({ selected, onChange }: Props) {
  return (
    <div className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
          selected === null
            ? 'bg-red-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
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
            className="shrink-0 rounded-full px-3 py-1 text-xs font-bold transition"
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
  );
}
