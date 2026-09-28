import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter } from '../../types';
import { ChapterCard } from '../syllabus/ChapterCard';
import { ChapterDetailModal } from '../syllabus/ChapterDetailModal';
import { RotateCcw, CheckCircle2, Clock, Sparkles, Filter, Check } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const RevisionQueue: React.FC = () => {
  const { userData, overallStats, toggleCheckpoint, openChapterModal } = useApp();
  const [filterMode, setFilterMode] = useState<'pending' | 'completed' | 'all'>('pending');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  // Chapters waiting for revision: Theory is TRUE, but Revision is FALSE
  const pendingRevisionChapters = useMemo(() => {
    return chaptersList.filter((ch) => ch.theory && !ch.revision);
  }, [chaptersList]);

  // Already revised chapters
  const completedRevisionChapters = useMemo(() => {
    return chaptersList.filter((ch) => ch.revision);
  }, [chaptersList]);

  const displayedChapters = useMemo(() => {
    let list: Chapter[] = [];
    if (filterMode === 'pending') {
      list = pendingRevisionChapters;
    } else if (filterMode === 'completed') {
      list = completedRevisionChapters;
    } else {
      list = chaptersList.filter((c) => c.theory);
    }

    if (subjectFilter !== 'all') {
      list = list.filter((c) => c.subjectId === subjectFilter);
    }

    return list;
  }, [filterMode, subjectFilter, pendingRevisionChapters, completedRevisionChapters, chaptersList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ChapterDetailModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Revision Queue
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Active Recall
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Chapters where Theory is finished and awaiting revision to prevent the forgetting curve
          </p>
        </div>

        {/* Revision completion rate pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">Revision Rate</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {overallStats.revisionPercentage}% ({completedRevisionChapters.length}/{overallStats.totalChapters})
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Waiting for Revision</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-white/20">
              {pendingRevisionChapters.length}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Revised ({completedRevisionChapters.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Active
          </button>
        </div>

        {/* Subject Filter Dropdown */}
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
        >
          <option value="all">All Subjects</option>
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
          <option value="social-science">Social Science</option>
          <option value="english">English</option>
        </select>
      </div>

      {/* Chapters Queue */}
      {displayedChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedChapters.map((ch) => (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {ch.subjectId} · Ch {ch.chapterNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {ch.assignedWeek ? `Week ${ch.assignedWeek}` : ''}
                  </span>
                </div>

                <h3
                  onClick={() => openChapterModal(ch.id)}
                  className="font-bold text-base text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {ch.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {ch.section}
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  <span>Theory Done</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCheckpoint(ch.id, 'revision')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    ch.revision
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{ch.revision ? 'Revision Completed' : 'Mark Revision Complete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            No Revision Pending!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Great job! All chapters with theory completed have been revised. Complete more chapters in the Syllabus to queue new revisions.
          </p>
        </div>
      )}
    </div>
  );
};
