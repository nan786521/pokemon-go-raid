import { useState } from 'react';
import type { Boss } from '../types';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  bosses: Boss[];
  onClose: () => void;
}

function estimateDifficulty(boss: Boss, trainers: number, avgLevel: number): { canWin: boolean; difficulty: string; cls: string } {
  // Simple estimation model based on tier, trainers, and level
  const tier = typeof boss.tier === 'number' ? boss.tier : 6;
  const requiredPower = tier * 10; // base difficulty score
  const teamPower = trainers * (avgLevel / 40) * 15; // team power

  const ratio = teamPower / requiredPower;
  if (ratio >= 2) return { canWin: true, difficulty: '輕鬆', cls: 'text-green-400' };
  if (ratio >= 1.3) return { canWin: true, difficulty: '穩定', cls: 'text-emerald-400' };
  if (ratio >= 1) return { canWin: true, difficulty: '可行', cls: 'text-yellow-400' };
  if (ratio >= 0.8) return { canWin: false, difficulty: '困難', cls: 'text-orange-400' };
  return { canWin: false, difficulty: '不可能', cls: 'text-red-400' };
}

export function RaidEstimator({ bosses, onClose }: Props) {
  const [bossId, setBossId] = useState('');
  const [trainers, setTrainers] = useState(3);
  const [avgLevel, setAvgLevel] = useState(40);

  const boss = bosses.find(b => b.id === bossId);
  const result = boss ? estimateDifficulty(boss, trainers, avgLevel) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="re-title"
        className="relative w-full max-w-sm overflow-y-auto rounded-2xl bg-gray-900 p-5 shadow-2xl max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800" aria-label="關閉">✕</button>

        <h2 id="re-title" className="mb-4 text-lg font-bold text-white">團戰難度評估</h2>

        {/* Boss selector */}
        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-400">選擇頭目</label>
          <select value={bossId} onChange={e => setBossId(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200">
            <option value="">請選擇...</option>
            {bosses.map(b => <option key={b.id} value={b.id}>{b.name['zh-TW']} ({typeof b.tier === 'number' ? `${b.tier}★` : b.category})</option>)}
          </select>
        </div>

        {/* Trainers */}
        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-400">參加人數: {trainers}</label>
          <input type="range" min={1} max={20} value={trainers} onChange={e => setTrainers(Number(e.target.value))} className="w-full" />
        </div>

        {/* Avg level */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-gray-400">平均訓練家等級: {avgLevel}</label>
          <input type="range" min={20} max={50} value={avgLevel} onChange={e => setAvgLevel(Number(e.target.value))} className="w-full" />
        </div>

        {/* Result */}
        {boss && result && (
          <div className="rounded-xl bg-gray-800 p-4 text-center">
            <img src={getSpriteUrl(boss.pokemon_id)} alt="" className="mx-auto h-16 w-16" style={{ imageRendering: 'pixelated' }} />
            <div className="mt-2 text-sm font-bold text-white">{boss.name['zh-TW']}</div>
            <div className="mt-1 text-xs text-gray-400">
              {trainers} 人 × Lv.{avgLevel}
            </div>
            <div className={`mt-2 text-2xl font-bold ${result.cls}`}>
              {result.difficulty}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {result.canWin ? '預計可以擊敗' : '可能需要更多人或更高等級'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              建議至少 {boss.min_trainers} 人
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
