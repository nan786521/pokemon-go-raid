import { useState, useEffect } from 'react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for SW update events from vite-plugin-pwa
    function onSWUpdate() {
      setShowUpdate(true);
    }
    // vite-plugin-pwa dispatches this custom event
    document.addEventListener('swUpdated', onSWUpdate);
    // Also check for controlling SW changes
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
    return () => document.removeEventListener('swUpdated', onSWUpdate);
  }, []);

  if (!showUpdate) return null;

  return (
    <div className="fixed top-16 left-3 right-3 z-50 mx-auto max-w-md rounded-xl border border-blue-700 bg-blue-900 p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-sm font-bold text-white">有新版本可用</div>
          <div className="text-xs text-blue-300">重新整理以取得最新資料</div>
        </div>
        <button
          onClick={() => location.reload()}
          className="shrink-0 rounded-full bg-blue-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-600"
        >
          更新
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          className="shrink-0 text-xs text-blue-400 hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
