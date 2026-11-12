import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
      title={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          {showLabel && <span>White Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
};
