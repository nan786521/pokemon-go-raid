import type { PokemonType } from '../types';

// Multiplier: 1.6 = super effective, 0.625 = not very effective, 0.391 = immune/double resist
type Row = Partial<Record<PokemonType, number>>;

const CHART: Record<PokemonType, Row> = {
  normal:   { rock: 0.625, ghost: 0.391, steel: 0.625 },
  fire:     { fire: 0.625, water: 0.625, grass: 1.6, ice: 1.6, bug: 1.6, rock: 0.625, dragon: 0.625, steel: 1.6 },
  water:    { fire: 1.6, water: 0.625, grass: 0.625, ground: 1.6, rock: 1.6, dragon: 0.625 },
  electric: { water: 1.6, electric: 0.625, grass: 0.625, ground: 0.391, flying: 1.6, dragon: 0.625 },
  grass:    { fire: 0.625, water: 1.6, grass: 0.625, poison: 0.625, ground: 1.6, flying: 0.625, bug: 0.625, rock: 1.6, dragon: 0.625, steel: 0.625 },
  ice:      { fire: 0.625, water: 0.625, grass: 1.6, ice: 0.625, ground: 1.6, flying: 1.6, dragon: 1.6, steel: 0.625 },
  fighting: { normal: 1.6, ice: 1.6, poison: 0.625, flying: 0.625, psychic: 0.625, bug: 0.625, rock: 1.6, ghost: 0.391, dark: 1.6, steel: 1.6, fairy: 0.625 },
  poison:   { grass: 1.6, poison: 0.625, ground: 0.625, rock: 0.625, ghost: 0.625, steel: 0.391, fairy: 1.6 },
  ground:   { fire: 1.6, electric: 1.6, grass: 0.625, poison: 1.6, flying: 0.391, bug: 0.625, rock: 1.6, steel: 1.6 },
  flying:   { electric: 0.625, grass: 1.6, fighting: 1.6, bug: 1.6, rock: 0.625, steel: 0.625 },
  psychic:  { fighting: 1.6, poison: 1.6, psychic: 0.625, dark: 0.391, steel: 0.625 },
  bug:      { fire: 0.625, grass: 1.6, fighting: 0.625, poison: 0.625, flying: 0.625, psychic: 1.6, ghost: 0.625, dark: 1.6, steel: 0.625, fairy: 0.625 },
  rock:     { fire: 1.6, ice: 1.6, fighting: 0.625, ground: 0.625, flying: 1.6, bug: 1.6, steel: 0.625 },
  ghost:    { normal: 0.391, psychic: 1.6, ghost: 1.6, dark: 0.625 },
  dragon:   { dragon: 1.6, steel: 0.625, fairy: 0.391 },
  dark:     { fighting: 0.625, psychic: 1.6, ghost: 1.6, dark: 0.625, fairy: 0.625 },
  steel:    { fire: 0.625, water: 0.625, electric: 0.625, ice: 1.6, rock: 1.6, steel: 0.625, fairy: 1.6 },
  fairy:    { fire: 0.625, fighting: 1.6, poison: 0.625, dragon: 1.6, dark: 1.6, steel: 0.625 },
};

export function getEffectiveness(attackType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  for (const def of defenderTypes) {
    multiplier *= CHART[attackType][def] ?? 1;
  }
  return multiplier;
}

export function getEffectivenessLabel(mult: number): { label: string; cls: string } {
  if (mult >= 2.56) return { label: '三重剋制', cls: 'text-red-400 font-bold' };
  if (mult >= 1.6)  return { label: '效果絕佳', cls: 'text-green-400 font-bold' };
  if (mult >= 1)    return { label: '一般效果', cls: 'text-gray-400' };
  if (mult >= 0.625) return { label: '效果不佳', cls: 'text-orange-400' };
  if (mult >= 0.391) return { label: '效果微弱', cls: 'text-red-500' };
  return { label: '無效', cls: 'text-gray-600' };
}

export { CHART as TYPE_CHART };
