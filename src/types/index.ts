export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type Recommendation = 'SSS' | 'SS' | 'S' | 'A' | 'B';

export type Category = 'dynamax' | 'gigantamax' | 'raid';

export type Accessibility = 'legendary' | 'common' | 'mega';

export type CounterRole = 'attacker' | 'tank' | 'healer';

export interface LocalizedName {
  'zh-TW': string;
  en: string;
  ja: string;
}

export interface Move {
  name: string;
  type: PokemonType;
}

export interface Counter {
  pokemon_id: number;
  name: LocalizedName;
  types: PokemonType[];
  fast_move: Move;
  charged_move: Move;
  dps: number;
  accessibility: Accessibility;
  is_shadow: boolean;
  is_mega: boolean;
  elite_tm_required: boolean;
  community_day_move: boolean;
  role?: CounterRole;
}

export interface Boss {
  id: string;
  name: LocalizedName;
  aliases: string[];
  category: Category;
  tier: number | string;
  types: PokemonType[];
  cp_range: {
    min: number;
    max: number;
    weather_min: number;
    weather_max: number;
  };
  weaknesses: PokemonType[];
  counters: Counter[];
  recommendation: Recommendation;
  rec_reason: string;
  pve_rating: number;
  pvp_rating: number;
  min_trainers: number;
  solo_possible: boolean;
  last_appeared: string;
  rotation_end: string;
  current: boolean;
  pokemon_id: number;
}
