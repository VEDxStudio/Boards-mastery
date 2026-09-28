import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Check } from 'lucide-react';

export const AssignWeekModal: React.FC = () => {
  const {
    assignWeekModalChapterId,
    closeAssignWeekModal,
    userData,
    assignChapterToWeek,
    showToast,
  } = useApp();

  if (!assignWeekModalChapterId) return null;

  const chapter = userData.chapters[assignWeekModalChapterId];
  if (!chapter) return null;

  const handleSelectWeek = (week: number | undefined) => {
    assignChapterToWeek(chapter.id, week);
    showToast(
      week ? `Assigned "${chapter.name}" to Week ${week}` : `Removed "${chapter.name}" from week schedule`,
      'success'
    );
    closeAssignWeekModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              8-Week Planner
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
              Assign to Week
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
              {chapter.name}
            </p>
          </div>
          <button
            onClick={closeAssignWeekModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
            const isCurrent = chapter.assignedWeek === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => handleSelectWeek(w)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>Week {w}</span>
                {isCurrent && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={() => handleSelectWeek(undefined)}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            Unassign from Week
          </button>
          <button
            type="button"
            onClick={closeAssignWeekModal}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
