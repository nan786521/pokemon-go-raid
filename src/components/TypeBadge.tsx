import { memo } from 'react';
import type { PokemonType } from '../types';
import { TYPE_COLORS } from '../utils/typeColors';

interface Props {
  type: PokemonType;
  size?: 'sm' | 'md';
}

export const TypeBadge = memo(function TypeBadge({ type, size = 'md' }: Props) {
  const info = TYPE_COLORS[type];
  const cls = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-sm';
  return (
    <span
      className={`type-badge inline-block rounded-full font-bold ${cls}`}
      style={{ backgroundColor: info.bg, color: info.text }}
    >
      {info.label}
    </span>
  );
});
