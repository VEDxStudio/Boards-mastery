import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { ProgressRing } from '../common/ProgressRing';
import { BookOpen, RotateCcw, FileQuestion, Target, CheckCircle2 } from 'lucide-react';

export const OverallProgressCard: React.FC = () => {
  const { overallStats, plannerStats } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Syllabus Completion</span>
          </div>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {overallStats.overallPercentage}%
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              ({overallStats.completedCheckpoints} of {overallStats.totalCheckpoints} checkpoints)
            </span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {overallStats.masteredChapters} chapters fully mastered across all 4 subjects.
          </p>

          <div className="mt-4 max-w-lg">
            <ProgressBar
              progress={overallStats.overallPercentage}
              heightClass="h-3"
              colorClass="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Circular Ring Overview */}
        <div className="shrink-0 flex items-center justify-center p-2">
          <ProgressRing
            progress={overallStats.overallPercentage}
            size={110}
            strokeWidth={9}
            colorClass="text-indigo-600 dark:text-indigo-400"
          >
            <div className="text-center">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {overallStats.masteredChapters}
              </span>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Mastered
              </span>
            </div>
          </ProgressRing>
        </div>
      </div>

      {/* 4 Pillars Breakdown (Theory, Revision, PYQ, Competency) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {/* Theory */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Theory</span>
            </div>
            <span>{overallStats.theoryPercentage}%</span>
          </div>
          <ProgressBar
            progress={overallStats.theoryPercentage}
            heightClass="h-2"
            colorClass="bg-blue-600 dark:bg-blue-400"
          />
          <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round((overallStats.theoryPercentage * overallStats.totalChapters) / 100)} / {overallStats.totalChapters} done
          </span>
        </div>

        {/* Revision */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Revision</span>
            </div>
            <span>{overallStats.revisionPercentage}%</span>
          </div>
          <ProgressBar
            progress={overallStats.revisionPercentage}
            heightClass="h-2"
            colorClass="bg-amber-600 dark:bg-amber-400"
          />
          <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round((overallStats.revisionPercentage * overallStats.totalChapters) / 100)} / {overallStats.totalChapters} revised
          </span>
        </div>

        {/* PYQs */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <FileQuestion className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>PYQs</span>
            </div>
            <span>{overallStats.pyqPercentage}%</span>
          </div>
          <ProgressBar
            progress={overallStats.pyqPercentage}
            heightClass="h-2"
            colorClass="bg-rose-600 dark:bg-rose-400"
          />
          <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round((overallStats.pyqPercentage * overallStats.totalChapters) / 100)} / {overallStats.totalChapters} solved
          </span>
        </div>

        {/* Competency */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Competency</span>
            </div>
            <span>{overallStats.competencyPercentage}%</span>
          </div>
          <ProgressBar
            progress={overallStats.competencyPercentage}
            heightClass="h-2"
            colorClass="bg-emerald-600 dark:bg-emerald-400"
          />
          <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round((overallStats.competencyPercentage * overallStats.totalChapters) / 100)} / {overallStats.totalChapters} practiced
          </span>
        </div>
      </div>
    </div>
  );
};
