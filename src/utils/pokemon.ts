const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getSpriteUrl(pokemonId: number): string {
  return `${SPRITE_BASE}/${pokemonId}.png`;
}

export function getOfficialArtUrl(pokemonId: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${pokemonId}.png`;
}
