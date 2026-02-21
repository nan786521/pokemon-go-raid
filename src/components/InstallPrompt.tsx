import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('pogo-install-dismissed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    setDeferredPrompt(null);
    try { localStorage.setItem('pogo-install-dismissed', '1'); } catch { /* ignore */ }
  }

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 mx-auto max-w-md animate-slide-up rounded-xl border border-gray-700 bg-gray-800 p-3 shadow-lg lg:bottom-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-sm font-bold text-white">安裝 POGO Raid</div>
          <div className="text-xs text-gray-400">加到主畫面，離線也能用</div>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-600"
        >
          安裝
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-xs text-gray-500 hover:text-gray-300"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
