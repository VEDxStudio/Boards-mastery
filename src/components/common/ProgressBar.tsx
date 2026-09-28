import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  heightClass?: string;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = 'bg-indigo-600 dark:bg-indigo-500',
  heightClass = 'h-2',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Completion</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
