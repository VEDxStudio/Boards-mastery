import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter } from '../../types';
import { ChapterDetailModal } from '../syllabus/ChapterDetailModal';
import { Target, CheckCircle2, Check, Award, Lightbulb, Percent } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const CompetencyQueue: React.FC = () => {
  const {
    userData,
    overallStats,
    toggleCheckpoint,
    updateChapter,
    openChapterModal,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'pending' | 'completed' | 'all'>('pending');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  const pendingCompChapters = useMemo(() => chaptersList.filter((c) => !c.competency), [chaptersList]);
  const completedCompChapters = useMemo(() => chaptersList.filter((c) => c.competency), [chaptersList]);

  const displayedChapters = useMemo(() => {
    let list: Chapter[] = [];
    if (filterMode === 'pending') {
      list = pendingCompChapters;
    } else if (filterMode === 'completed') {
      list = completedCompChapters;
    } else {
      list = chaptersList;
    }

    if (subjectFilter !== 'all') {
      list = list.filter((c) => c.subjectId === subjectFilter);
    }

    return list;
  }, [filterMode, subjectFilter, pendingCompChapters, completedCompChapters, chaptersList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ChapterDetailModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              CBSE Competency Practice
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              50% Board Weightage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Case-based scenarios, Assertion-Reason, and higher-order analytical reasoning
          </p>
        </div>

        {/* Competency Rate Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">Competency Rate</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {overallStats.competencyPercentage}% ({completedCompChapters.length}/{overallStats.totalChapters})
            </span>
          </div>
        </div>
      </div>

      {/* Informative CBSE Guidelines Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 text-white shadow-sm flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-white/10 shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-300" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-bold text-white text-sm block">
            Why Competency-Based Learning Matters for 2026–27
          </span>
          <p className="text-emerald-100/90 leading-relaxed">
            The CBSE Board Examination dedicates 50% of total question weightage to competency-based questions (Case Studies, Source-based integrated questions, Data interpretations). Rote learning is not enough — practice applying chapter concepts to unfamiliar real-world situations!
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Competency Mastered
          </span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {completedCompChapters.length}
          </span>
          <p className="text-[11px] text-slate-500">Case-based questions completed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Practice
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {pendingCompChapters.length}
          </span>
          <p className="text-[11px] text-slate-500">Chapters waiting for application sets</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Progress Pace
          </span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {overallStats.competencyPercentage}%
          </span>
          <ProgressBar progress={overallStats.competencyPercentage} heightClass="h-2" colorClass="bg-emerald-500" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Pending ({pendingCompChapters.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Completed ({completedCompChapters.length})</span>
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
          {displayedChapters.map((ch) => {
            const attempted = ch.competencyAttempted || 0;
            const correct = ch.competencyCorrect || 0;
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 hover:border-emerald-300 dark:hover:border-emerald-900/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
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
                    onClick={() => toggleCheckpoint(ch.id, 'competency')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      ch.competency
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                    }`}
                    title="Mark Competency Practice completed"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>

                {/* Score & Accuracy metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Attempted</span>
                    <input
                      type="number"
                      min="0"
                      defaultValue={ch.competencyAttempted || ''}
                      placeholder="0"
                      onBlur={(e) =>
                        updateChapter(ch.id, {
                          competencyAttempted: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full text-center bg-white dark:bg-slate-900 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Correct</span>
                    <input
                      type="number"
                      min="0"
                      defaultValue={ch.competencyCorrect || ''}
                      placeholder="0"
                      onBlur={(e) =>
                        updateChapter(ch.id, {
                          competencyCorrect: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full text-center bg-white dark:bg-slate-900 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-black text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 block">Accuracy</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {accuracy}%
                    </span>
                  </div>
                </div>

                {/* Reflection Notes */}
                <div className="pt-1">
                  <input
                    type="text"
                    defaultValue={ch.competencyMistakes || ''}
                    placeholder="Mistake reflection / Assertion-Reason takeaway..."
                    onBlur={(e) => updateChapter(ch.id, { competencyMistakes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            All Competency Sets Completed!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You are fully up to date with competency-based questions for this subject filter.
          </p>
        </div>
      )}
    </div>
  );
};
