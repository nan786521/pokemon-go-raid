import type { PokemonType } from '../types';
import { TYPE_COLORS, ALL_TYPES } from '../utils/typeColors';

interface Props {
  selected: PokemonType[];
  onChange: (types: PokemonType[]) => void;
  mode: 'type' | 'weakness';
  onModeChange: (mode: 'type' | 'weakness') => void;
}

export function TypeFilter({ selected, onChange, mode, onModeChange }: Props) {
  return (
    <div className="relative" role="group" aria-label="屬性篩選">
      <div className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {/* Mode toggle: 屬性 / 弱點 */}
        <div className="flex shrink-0 rounded-lg bg-gray-800 p-0.5" role="group" aria-label="篩選模式">
          <button
            onClick={() => onModeChange('type')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mode === 'type'
                ? 'bg-gray-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            屬性
          </button>
          <button
            onClick={() => onModeChange('weakness')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mode === 'weakness'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            弱點
          </button>
        </div>

        <button
          onClick={() => onChange([])}
          aria-pressed={selected.length === 0}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition md:shrink ${
            selected.length === 0
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          全屬性
        </button>
        {ALL_TYPES.map(t => {
          const info = TYPE_COLORS[t];
          const active = selected.includes(t);
          return (
            <button
              key={t}
              onClick={() => onChange(
                active ? selected.filter(x => x !== t) : [...selected, t]
              )}
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
