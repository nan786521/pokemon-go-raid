import type { Recommendation } from '../types';

interface RecommendInfo {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const RECOMMEND_INFO: Record<Recommendation, RecommendInfo> = {
  SSS: { label: '必打',     emoji: '🔥', color: '#fff', bgColor: '#dc2626' },
  SS:  { label: '非常推薦', emoji: '⭐', color: '#fff', bgColor: '#ea580c' },
  S:   { label: '推薦',     emoji: '✅', color: '#fff', bgColor: '#16a34a' },
  A:   { label: '可打可不打', emoji: '⚖️', color: '#fff', bgColor: '#6b7280' },
  B:   { label: '可以跳過', emoji: '❌', color: '#fff', bgColor: '#9ca3af' },
};

export const RECOMMEND_ORDER: Recommendation[] = ['SSS', 'SS', 'S', 'A', 'B'];
