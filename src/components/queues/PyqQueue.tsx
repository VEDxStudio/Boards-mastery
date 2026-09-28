import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter } from '../../types';
import { ChapterDetailModal } from '../syllabus/ChapterDetailModal';
import { GoogleDriveBrowserModal } from '../resources/GoogleDriveBrowserModal';
import {
  FileQuestion,
  CheckCircle2,
  Paperclip,
  Check,
  FolderSync,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const PyqQueue: React.FC = () => {
  const {
    userData,
    overallStats,
    toggleCheckpoint,
    updateChapter,
    openChapterModal,
    openDriveBrowser,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'pending' | 'completed' | 'all'>('pending');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  const pendingPyqChapters = useMemo(() => chaptersList.filter((c) => !c.pyq), [chaptersList]);
  const completedPyqChapters = useMemo(() => chaptersList.filter((c) => c.pyq), [chaptersList]);

  const displayedChapters = useMemo(() => {
    let list: Chapter[] = [];
    if (filterMode === 'pending') {
      list = pendingPyqChapters;
    } else if (filterMode === 'completed') {
      list = completedPyqChapters;
    } else {
      list = chaptersList;
    }

    if (subjectFilter !== 'all') {
      list = list.filter((c) => c.subjectId === subjectFilter);
    }

    return list;
  }, [filterMode, subjectFilter, pendingPyqChapters, completedPyqChapters, chaptersList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ChapterDetailModal />
      <GoogleDriveBrowserModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              PYQ Mastery
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
              Board Papers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track past 5–10 years CBSE board questions solved per chapter
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">PYQ Completion</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {overallStats.pyqPercentage}% ({completedPyqChapters.length}/{overallStats.totalChapters})
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            PYQ Solved Chapters
          </span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {completedPyqChapters.length}
          </span>
          <p className="text-[11px] text-slate-500">Fully solved & verified</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            PYQs Pending
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {pendingPyqChapters.length}
          </span>
          <p className="text-[11px] text-slate-500">Chapters waiting for past year practice</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Board Readiness
          </span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {overallStats.pyqPercentage}%
          </span>
          <ProgressBar progress={overallStats.pyqPercentage} heightClass="h-2" colorClass="bg-rose-500" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Pending ({pendingPyqChapters.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Completed ({completedPyqChapters.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Chapters
          </button>
        </div>

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

      {/* Chapters list */}
      {displayedChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedChapters.map((ch) => (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 hover:border-rose-300 dark:hover:border-rose-900/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    {ch.subjectId} · Ch {ch.chapterNumber}
                  </span>
                  <h3
                    onClick={() => openChapterModal(ch.id)}
                    className="font-bold text-base text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                  >
                    {ch.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {ch.section}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCheckpoint(ch.id, 'pyq')}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    ch.pyq
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-rose-500 text-transparent'
                  }`}
                  title="Mark PYQ solved"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Questions Solved & Mistakes Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Questions Solved:
                  </span>
                  <input
                    type="number"
                    min="0"
                    defaultValue={ch.pyqQuestionsSolved || ''}
                    placeholder="e.g. 25"
                    onBlur={(e) =>
                      updateChapter(ch.id, {
                        pyqQuestionsSolved: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Mistakes / Weak Qs:
                  </span>
                  <input
                    type="text"
                    defaultValue={ch.pyqMistakes || ''}
                    placeholder="e.g. Q4 proof, 2023 set 2"
                    onBlur={(e) => updateChapter(ch.id, { pyqMistakes: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => openDriveBrowser(ch.id)}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-semibold"
                >
                  <FolderSync className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Attach PYQ PDF</span>
                </button>

                <button
                  onClick={() => openChapterModal(ch.id)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            All Caught Up with PYQs!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            All chapters in this filter view have completed PYQs. Keep revising and practicing sample mock papers!
          </p>
        </div>
      )}
    </div>
  );
};
