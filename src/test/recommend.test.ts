import { describe, it, expect } from 'vitest';
import { RECOMMEND_ORDER, RECOMMEND_INFO } from '../utils/recommend';

describe('RECOMMEND_ORDER', () => {
  it('should have SSS first', () => {
    expect(RECOMMEND_ORDER[0]).toBe('SSS');
  });

  it('should have 5 levels', () => {
    expect(RECOMMEND_ORDER).toHaveLength(5);
  });

  it('should be in descending order', () => {
    expect(RECOMMEND_ORDER).toEqual(['SSS', 'SS', 'S', 'A', 'B']);
  });
});

describe('RECOMMEND_INFO', () => {
  it('should have info for all levels', () => {
    for (const level of RECOMMEND_ORDER) {
      const info = RECOMMEND_INFO[level];
      expect(info).toBeDefined();
      expect(info.label).toBeTruthy();
      expect(info.emoji).toBeTruthy();
      expect(info.color).toBeTruthy();
      expect(info.bgColor).toBeTruthy();
    }
  });
});
