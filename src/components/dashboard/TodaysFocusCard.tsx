import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, CheckCircle2, Circle, Sparkles, BookOpen, RotateCcw, FileQuestion, Target } from 'lucide-react';

export const TodaysFocusCard: React.FC = () => {
  const { todaysFocusTasks, toggleCheckpoint, openChapterModal } = useApp();

  if (todaysFocusTasks.length === 0) {
    return null;
  }

  const getTaskIcon = (type: 'theory' | 'revision' | 'pyq' | 'competency') => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'revision':
        return <RotateCcw className="w-3.5 h-3.5 text-amber-500" />;
      case 'pyq':
        return <FileQuestion className="w-3.5 h-3.5 text-rose-500" />;
      case 'competency':
        return <Target className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Today's Focus
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick milestone actions targeted for maximum progress
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {todaysFocusTasks.length} Recommended
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {todaysFocusTasks.map((task) => {
          const isDone = task.chapter[task.taskType];

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                isDone
                  ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 line-through'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Checkbox Button */}
                <button
                  onClick={() => toggleCheckpoint(task.chapter.id, task.taskType)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
                  }`}
                  aria-label={`Toggle ${task.label}`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div
                  onClick={() => openChapterModal(task.chapter.id)}
                  className="cursor-pointer min-w-0 flex-1"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {getTaskIcon(task.taskType)}
                    <span>{task.subjectName}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold truncate">
                    {task.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
