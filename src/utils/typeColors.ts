import type { PokemonType } from '../types';

interface TypeColorInfo {
  bg: string;
  text: string;
  label: string;
}

export const TYPE_COLORS: Record<PokemonType, TypeColorInfo> = {
  normal:   { bg: '#A8A77A', text: '#fff', label: '一般' },
  fire:     { bg: '#EE8130', text: '#fff', label: '火' },
  water:    { bg: '#6390F0', text: '#fff', label: '水' },
  electric: { bg: '#F7D02C', text: '#333', label: '電' },
  grass:    { bg: '#7AC74C', text: '#fff', label: '草' },
  ice:      { bg: '#96D9D6', text: '#333', label: '冰' },
  fighting: { bg: '#C22E28', text: '#fff', label: '格鬥' },
  poison:   { bg: '#A33EA1', text: '#fff', label: '毒' },
  ground:   { bg: '#E2BF65', text: '#333', label: '地面' },
  flying:   { bg: '#A98FF3', text: '#fff', label: '飛行' },
  psychic:  { bg: '#F95587', text: '#fff', label: '超能力' },
  bug:      { bg: '#A6B91A', text: '#fff', label: '蟲' },
  rock:     { bg: '#B6A136', text: '#fff', label: '岩石' },
  ghost:    { bg: '#735797', text: '#fff', label: '幽靈' },
  dragon:   { bg: '#6F35FC', text: '#fff', label: '龍' },
  dark:     { bg: '#705746', text: '#fff', label: '惡' },
  steel:    { bg: '#B7B7CE', text: '#333', label: '鋼' },
  fairy:    { bg: '#D685AD', text: '#fff', label: '妖精' },
};

export const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];
