import { useState } from 'react';
import type { PokemonType } from '../types';
import { ALL_TYPES, TYPE_COLORS } from '../utils/typeColors';
import { getEffectiveness, getEffectivenessLabel } from '../utils/typeEffectiveness';

interface Props {
  onClose: () => void;
}

export function TypeCalculator({ onClose }: Props) {
  const [attackType, setAttackType] = useState<PokemonType>('fire');
  const [defTypes, setDefTypes] = useState<PokemonType[]>(['grass']);

  function toggleDefType(t: PokemonType) {
    setDefTypes(prev => {
      if (prev.includes(t)) return prev.filter(x => x !== t);
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  }

  const mult = defTypes.length > 0 ? getEffectiveness(attackType, defTypes) : 1;
  const { label, cls } = getEffectivenessLabel(mult);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tc-title"
        className="relative w-full max-w-md overflow-y-auto rounded-2xl bg-gray-900 p-5 shadow-2xl max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>

        <h2 id="tc-title" className="mb-4 text-lg font-bold text-white">屬性計算機</h2>

        {/* Attack type */}
        <div className="mb-3">
          <h3 className="mb-2 text-sm font-medium text-gray-300">攻擊屬性</h3>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map(t => {
              const info = TYPE_COLORS[t];
              const active = attackType === t;
              return (
                <button
                  key={t}
                  onClick={() => setAttackType(t)}
                  className="rounded-full px-2.5 py-1 text-xs font-bold transition"
                  style={{
                    backgroundColor: active ? info.bg : undefined,
                    color: active ? info.text : info.bg,
                    border: active ? 'none' : `1.5px solid ${info.bg}`,
                  }}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Defense types */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-300">防禦屬性（最多 2 個）</h3>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map(t => {
              const info = TYPE_COLORS[t];
              const active = defTypes.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleDefType(t)}
                  className="rounded-full px-2.5 py-1 text-xs font-bold transition"
                  style={{
                    backgroundColor: active ? info.bg : undefined,
                    color: active ? info.text : info.bg,
                    border: active ? 'none' : `1.5px solid ${info.bg}`,
                  }}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl bg-gray-800 p-4 text-center">
          <div className="mb-1 text-sm text-gray-400">
            <span className="font-bold" style={{ color: TYPE_COLORS[attackType].bg }}>{TYPE_COLORS[attackType].label}</span>
            {' → '}
            {defTypes.map((t, i) => (
              <span key={t}>
                {i > 0 && '/'}
                <span className="font-bold" style={{ color: TYPE_COLORS[t].bg }}>{TYPE_COLORS[t].label}</span>
              </span>
            ))}
          </div>
          <div className="text-3xl font-bold text-white">×{mult.toFixed(3)}</div>
          <div className={`mt-1 text-sm ${cls}`}>{label}</div>
        </div>
      </div>
    </div>
  );
}
