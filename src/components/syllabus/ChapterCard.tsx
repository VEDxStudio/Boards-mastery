import React from 'react';
import { Chapter } from '../../types';
import { useApp } from '../../context/AppContext';
import { Check, Paperclip, FileText, Calendar, MoreVertical } from 'lucide-react';
import { AssessmentBadge, PriorityBadge, StatusBadge } from '../common/Badge';

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const { toggleCheckpoint, openChapterModal, openAssignWeekModal } = useApp();

  const completedCount =
    (chapter.theory ? 1 : 0) +
    (chapter.revision ? 1 : 0) +
    (chapter.pyq ? 1 : 0) +
    (chapter.competency ? 1 : 0);

  const status =
    completedCount === 4 ? 'mastered' : completedCount > 0 ? 'in_progress' : 'not_started';

  const checkpoints: Array<{
    id: 'theory' | 'revision' | 'pyq' | 'competency';
    label: string;
    checked: boolean;
    color: string;
    activeBg: string;
  }> = [
    {
      id: 'theory',
      label: 'Theory',
      checked: chapter.theory,
      color: 'border-blue-500 text-blue-600',
      activeBg: 'bg-blue-600 text-white border-blue-600',
    },
    {
      id: 'revision',
      label: 'Revision',
      checked: chapter.revision,
      color: 'border-amber-500 text-amber-600',
      activeBg: 'bg-amber-600 text-white border-amber-600',
    },
    {
      id: 'pyq',
      label: 'PYQ',
      checked: chapter.pyq,
      color: 'border-rose-500 text-rose-600',
      activeBg: 'bg-rose-600 text-white border-rose-600',
    },
    {
      id: 'competency',
      label: 'Competency',
      checked: chapter.competency,
      color: 'border-emerald-500 text-emerald-600',
      activeBg: 'bg-emerald-600 text-white border-emerald-600',
    },
  ];

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-200 border ${
        status === 'mastered'
          ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200/90 dark:border-emerald-900/60 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Top row: Chapter Number, Name, Badges, and Details trigger */}
      <div className="flex items-start justify-between gap-3">
        <div
          onClick={() => openChapterModal(chapter.id)}
          className="cursor-pointer min-w-0 flex-1 group"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Ch {chapter.chapterNumber}
            </span>
            <AssessmentBadge type={chapter.assessmentType} />
            <PriorityBadge priority={chapter.priority} />
            {chapter.unitMarks !== undefined && chapter.unitMarks > 0 && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                ~{chapter.unitMarks}m
              </span>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {chapter.name}
          </h4>

          {chapter.subtopics && chapter.subtopics.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {chapter.subtopics.slice(0, 2).join(' · ')}
              {chapter.subtopics.length > 2 && ' ...'}
            </p>
          )}
        </div>

        {/* Right side status badge and Week assign button */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={status} />

          <button
            onClick={() => openAssignWeekModal(chapter.id)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Assign chapter to study week"
          >
            <Calendar className="w-3 h-3 text-indigo-500" />
            <span>{chapter.assignedWeek ? `W${chapter.assignedWeek}` : 'Assign'}</span>
          </button>
        </div>
      </div>

      {/* Chapter 4 Checkbox Grid (Mobile optimized with large tap areas) */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {checkpoints.map((cp) => {
            return (
              <button
                key={cp.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheckpoint(chapter.id, cp.id);
                }}
                className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all select-none min-h-[44px] ${
                  cp.checked
                    ? cp.activeBg
                    : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <span>{cp.label}</span>
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    cp.checked
                      ? 'bg-white/20 border-transparent text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meta indicators: Notes, Resources, Last Studied */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          {chapter.notes && chapter.notes.trim() && (
            <span
              onClick={() => openChapterModal(chapter.id)}
              className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </span>
          )}
          {chapter.resources && chapter.resources.length > 0 && (
            <span
              onClick={() => openChapterModal(chapter.id)}
              className="cursor-pointer inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>{chapter.resources.length} file(s)</span>
            </span>
          )}
        </div>

        {chapter.lastStudied && (
          <span className="truncate">
            Studied {new Date(chapter.lastStudied).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
