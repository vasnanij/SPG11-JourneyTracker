import React from 'react';
import { Compass } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconBoxSize =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const iconSize =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`${iconBoxSize} rounded-xl bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/20`}
      >
        <Compass className={iconSize} />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`${textSize} font-bold tracking-tight text-slate-900 dark:text-white`}
        >
          SPG11{' '}
          <span className="text-teal-600 dark:text-teal-400">Journey Tracker</span>
        </span>
      </div>
    </div>
  );
};
