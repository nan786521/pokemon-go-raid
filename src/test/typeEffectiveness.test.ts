import { describe, it, expect } from 'vitest';
import { getEffectiveness, getEffectivenessLabel } from '../utils/typeEffectiveness';

describe('getEffectiveness', () => {
  it('should return 1.6 for super effective', () => {
    expect(getEffectiveness('fire', ['grass'])).toBe(1.6);
    expect(getEffectiveness('water', ['fire'])).toBe(1.6);
    expect(getEffectiveness('electric', ['water'])).toBe(1.6);
  });

  it('should return 0.625 for not very effective', () => {
    expect(getEffectiveness('fire', ['water'])).toBe(0.625);
    expect(getEffectiveness('grass', ['fire'])).toBe(0.625);
  });

  it('should return 0.391 for immune/double resist', () => {
    expect(getEffectiveness('normal', ['ghost'])).toBe(0.391);
    expect(getEffectiveness('electric', ['ground'])).toBe(0.391);
    expect(getEffectiveness('fighting', ['ghost'])).toBe(0.391);
  });

  it('should return 1 for neutral', () => {
    expect(getEffectiveness('fire', ['normal'])).toBe(1);
    expect(getEffectiveness('water', ['psychic'])).toBe(1);
  });

  it('should multiply for dual types', () => {
    // Fire vs Grass/Steel = 1.6 * 1.6 = 2.56
    const result = getEffectiveness('fire', ['grass', 'steel']);
    expect(result).toBeCloseTo(2.56, 2);
  });

  it('should handle SE + NVE dual type', () => {
    // Fire vs Grass/Water = 1.6 * 0.625 = 1.0
    const result = getEffectiveness('fire', ['grass', 'water']);
    expect(result).toBeCloseTo(1.0, 2);
  });
});

describe('getEffectivenessLabel', () => {
  it('should return correct labels', () => {
    expect(getEffectivenessLabel(2.56).label).toBe('三重剋制');
    expect(getEffectivenessLabel(1.6).label).toBe('效果絕佳');
    expect(getEffectivenessLabel(1.0).label).toBe('一般效果');
    expect(getEffectivenessLabel(0.625).label).toBe('效果不佳');
    expect(getEffectivenessLabel(0.391).label).toBe('效果微弱');
  });
});
