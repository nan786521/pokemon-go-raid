import { memo } from 'react';
import type { Boss } from '../types';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  suggestions: Boss[];
  onSelect: (boss: Boss) => void;
  visible: boolean;
}

export const SearchSuggestions = memo(function SearchSuggestions({ suggestions, onSelect, visible }: Props) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <ul
      role="listbox"
      className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-600 bg-gray-800 shadow-xl"
    >
      {suggestions.map(b => (
        <li key={b.id}>
          <button
            role="option"
            onClick={() => onSelect(b)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-gray-700"
          >
            <img
              src={getSpriteUrl(b.pokemon_id)}
              alt=""
              className="h-6 w-6 shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-sm font-medium text-white">{b.name['zh-TW']}</span>
            <span className="text-xs text-gray-400">{b.name.en}</span>
          </button>
        </li>
      ))}
    </ul>
  );
});
