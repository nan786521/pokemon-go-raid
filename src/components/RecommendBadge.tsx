import { memo } from 'react';
import type { Recommendation } from '../types';
import { RECOMMEND_INFO } from '../utils/recommend';

interface Props {
  level: Recommendation;
}

export const RecommendBadge = memo(function RecommendBadge({ level }: Props) {
  const info = RECOMMEND_INFO[level];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold shadow-sm"
      style={{ backgroundColor: info.bgColor, color: info.color }}
    >
      <span>{info.emoji}</span>
      <span>{level} {info.label}</span>
    </span>
  );
});
