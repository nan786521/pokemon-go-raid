import { describe, it, expect } from 'vitest';
import { matchesBoss } from '../utils/search';
import type { Boss } from '../types';

const mockBoss: Boss = {
  id: 'mewtwo',
  name: { 'zh-TW': '超夢', en: 'Mewtwo', ja: 'ミュウツー' },
  aliases: ['M2', '百五零'],
  category: 'raid',
  tier: 5,
  types: ['psychic'],
  cp_range: { min: 2294, max: 2387, weather_min: 2868, weather_max: 2984 },
  weaknesses: ['bug', 'ghost', 'dark'],
  counters: [],
  recommendation: 'SSS',
  rec_reason: 'test',
  pve_rating: 5,
  pvp_rating: 4,
  min_trainers: 3,
  solo_possible: false,
  last_appeared: '2025-09-01',
  rotation_end: '2026-03-15',
  current: true,
  pokemon_id: 150,
};

describe('matchesBoss', () => {
  it('should match by Chinese name', () => {
    expect(matchesBoss(mockBoss, '超夢')).toBe(true);
  });

  it('should match by English name (case insensitive)', () => {
    expect(matchesBoss(mockBoss, 'mewtwo')).toBe(true);
    expect(matchesBoss(mockBoss, 'MEWTWO')).toBe(true);
  });

  it('should match by Japanese name', () => {
    expect(matchesBoss(mockBoss, 'ミュウツー')).toBe(true);
  });

  it('should match by alias', () => {
    expect(matchesBoss(mockBoss, 'M2')).toBe(true);
    expect(matchesBoss(mockBoss, '百五零')).toBe(true);
  });

  it('should match by id', () => {
    expect(matchesBoss(mockBoss, 'mewtwo')).toBe(true);
  });

  it('should return false for non-matching query', () => {
    expect(matchesBoss(mockBoss, '皮卡丘')).toBe(false);
    expect(matchesBoss(mockBoss, 'Pikachu')).toBe(false);
  });

  it('should return true for empty query', () => {
    expect(matchesBoss(mockBoss, '')).toBe(true);
  });

  it('should handle partial matches', () => {
    expect(matchesBoss(mockBoss, '超')).toBe(true);
    expect(matchesBoss(mockBoss, 'Mew')).toBe(true);
  });
});
