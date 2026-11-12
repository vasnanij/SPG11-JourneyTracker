import React from 'react';
import { WifiOff, Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const OfflineAndInstallBanner: React.FC = () => {
  const { isOnline, isInstallable, promptInstall } = usePWA();

  return (
    <>
      {!isOnline && (
        <div
          role="alert"
          className="bg-amber-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            You are currently offline. Static resources remain available; changes will sync when your connection is restored.
          </span>
        </div>
      )}
      {isInstallable && (
        <div className="bg-teal-900 text-teal-50 px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-4 border-b border-teal-800">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-teal-300 shrink-0" />
            <span>Install SPG11 Journey Tracker as an app on your device for quick access.</span>
          </div>
          <button
            type="button"
            onClick={promptInstall}
            className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shrink-0 transition-colors"
          >
            Install App
          </button>
        </div>
      )}
    </>
  );
};
