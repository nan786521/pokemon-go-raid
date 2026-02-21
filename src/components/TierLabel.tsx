import { memo } from 'react';
import type { Boss } from '../types';

export const TierLabel = memo(function TierLabel({ boss }: { boss: Boss }) {
  if (boss.category === 'shadow') return <span className="text-xs font-bold text-indigo-400">暗影 {'★'.repeat(typeof boss.tier === 'number' ? boss.tier : 5)}</span>;
  if (boss.category === 'dynamax') return <span className="text-xs font-bold text-orange-500">極巨化</span>;
  if (boss.category === 'gigantamax') return <span className="text-xs font-bold text-purple-500">超極巨化</span>;
  return <span className="text-xs font-bold text-yellow-600">{'★'.repeat(typeof boss.tier === 'number' ? boss.tier : 5)}</span>;
});
