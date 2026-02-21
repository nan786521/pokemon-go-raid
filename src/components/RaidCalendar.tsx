import type { Boss } from '../types';
import { getSpriteUrl } from '../utils/pokemon';

interface Props {
  bosses: Boss[];
  onClose: () => void;
  onSelect: (boss: Boss) => void;
}

function formatDate(iso: string): string {
  if (!iso) return '未知';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function daysLeft(iso: string): number {
  if (!iso) return -1;
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 86400000));
}

export function RaidCalendar({ bosses, onClose, onSelect }: Props) {
  const current = bosses.filter(b => b.current && b.rotation_end);
  const past = bosses.filter(b => !b.current && b.last_appeared).sort(
    (a, b) => new Date(b.last_appeared).getTime() - new Date(a.last_appeared).getTime()
  ).slice(0, 20);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rc-title"
        className="relative w-full max-w-lg overflow-y-auto rounded-2xl bg-gray-900 p-5 shadow-2xl max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>

        <h2 id="rc-title" className="mb-4 text-lg font-bold text-white">團戰輪替日曆</h2>

        {/* Current rotation */}
        {current.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-bold text-green-400">目前輪替中</h3>
            <div className="space-y-2">
              {current.map(b => {
                const days = daysLeft(b.rotation_end);
                return (
                  <button
                    key={b.id}
                    onClick={() => { onSelect(b); onClose(); }}
                    className="flex w-full items-center gap-3 rounded-xl bg-gray-800 p-3 text-left transition hover:bg-gray-700"
                  >
                    <img src={getSpriteUrl(b.pokemon_id)} alt="" className="h-10 w-10" style={{ imageRendering: 'pixelated' }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white">{b.name['zh-TW']}</div>
                      <div className="text-xs text-gray-400">
                        結束：{formatDate(b.rotation_end)}
                        {days >= 0 && <span className="ml-1 text-emerald-400">（剩 {days} 天）</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Past rotations */}
        {past.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-bold text-gray-400">過去登場</h3>
            <div className="space-y-1">
              {past.map(b => (
                <button
                  key={b.id}
                  onClick={() => { onSelect(b); onClose(); }}
                  className="flex w-full items-center gap-3 rounded-lg bg-gray-800/50 px-3 py-2 text-left transition hover:bg-gray-700"
                >
                  <img src={getSpriteUrl(b.pokemon_id)} alt="" className="h-8 w-8 opacity-70" style={{ imageRendering: 'pixelated' }} />
                  <span className="text-sm text-gray-300">{b.name['zh-TW']}</span>
                  <span className="ml-auto text-xs text-gray-500">{formatDate(b.last_appeared)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {current.length === 0 && past.length === 0 && (
          <div className="py-8 text-center text-gray-500">目前沒有輪替資料</div>
        )}
      </div>
    </div>
  );
}
