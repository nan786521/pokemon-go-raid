import { memo } from 'react';

interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

export const FavoriteButton = memo(function FavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className="shrink-0 p-1 text-lg transition"
      aria-label={isFavorite ? '取消收藏' : '加入收藏'}
      aria-pressed={isFavorite}
    >
      <span className={isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}>
        {isFavorite ? '★' : '☆'}
      </span>
    </button>
  );
});
