import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { ProgressBar } from '../common/ProgressBar';
import { ProgressRing } from '../common/ProgressRing';
import {
  BarChart3,
  Flame,
  Award,
  BookOpen,
  RotateCcw,
  FileQuestion,
  Target,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { overallStats, subjectStats, userData, plannerStats } = useApp();

  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  // Compute weekly completion numbers
  const weeklyDistribution = useMemo(() => {
    const list: Array<{ week: number; total: number; done: number; percentage: number }> = [];

    for (let w = 1; w <= 8; w++) {
      const weekChapters = chaptersList.filter((c) => c.assignedWeek === w);
      const totalCp = weekChapters.length * 4;
      let doneCp = 0;
      for (const ch of weekChapters) {
        doneCp += (ch.theory ? 1 : 0) + (ch.revision ? 1 : 0) + (ch.pyq ? 1 : 0) + (ch.competency ? 1 : 0);
      }
      const pct = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;
      list.push({ week: w, total: totalCp, done: doneCp, percentage: pct });
    }

    return list;
  }, [chaptersList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analytics & Progress Insights
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            Real-time Metrics
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Detailed breakdown of your syllabus completion velocity across all 4 core subjects
        </p>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Overall Completion
          </span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {overallStats.overallPercentage}%
          </span>
          <p className="text-[11px] text-slate-500">
            {overallStats.completedCheckpoints} / {overallStats.totalCheckpoints} checkpoints
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Mastered Chapters
          </span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {overallStats.masteredChapters}
          </span>
          <p className="text-[11px] text-slate-500">
            of {overallStats.totalChapters} chapters (4/4 complete)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Study Streak
          </span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {userData.streak || 1}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Consecutive days active</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Remaining Milestones
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {overallStats.totalCheckpoints - overallStats.completedCheckpoints}
          </span>
          <p className="text-[11px] text-slate-500">
            Across {plannerStats.daysRemaining} days left
          </p>
        </div>
      </div>

      {/* Subject Breakdown & Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Subject Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Progress by Subject
            </h3>
            <span className="text-xs text-slate-400 font-bold">Class X CBSE</span>
          </div>

          <div className="space-y-4">
            {CBSE_SYLLABUS.map((sub) => {
              const stats = subjectStats[sub.id];
              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">
                      {stats?.percentage || 0}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={stats?.percentage || 0}
                    heightClass="h-2.5"
                    colorClass={sub.colorScheme.dark}
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{stats?.masteredCount || 0} mastered</span>
                    <span>{stats?.totalChapters || 0} total chapters</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Activity Breakdown (The 4 Pillars) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Progress by Activity Pillar
            </h3>
            <span className="text-xs text-slate-400 font-bold">4 Key Criteria</span>
          </div>

          <div className="space-y-4">
            {/* Theory */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Theory Coverage</span>
                </div>
                <span>{overallStats.theoryPercentage}%</span>
              </div>
              <ProgressBar
                progress={overallStats.theoryPercentage}
                heightClass="h-2.5"
                colorClass="bg-blue-600"
              />
            </div>

            {/* Revision */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Revision Coverage</span>
                </div>
                <span>{overallStats.revisionPercentage}%</span>
              </div>
              <ProgressBar
                progress={overallStats.revisionPercentage}
                heightClass="h-2.5"
                colorClass="bg-amber-600"
              />
            </div>

            {/* PYQ */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                <div className="flex items-center gap-1.5">
                  <FileQuestion className="w-4 h-4" />
                  <span>PYQ Solving</span>
                </div>
                <span>{overallStats.pyqPercentage}%</span>
              </div>
              <ProgressBar
                progress={overallStats.pyqPercentage}
                heightClass="h-2.5"
                colorClass="bg-rose-600"
              />
            </div>

            {/* Competency */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>Competency Practice</span>
                </div>
                <span>{overallStats.competencyPercentage}%</span>
              </div>
              <ProgressBar
                progress={overallStats.competencyPercentage}
                heightClass="h-2.5"
                colorClass="bg-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Over Time Bar Graph */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              8-Week Milestone Completion Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Checkpoints finished by week allocation (1 to 8)
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            Week {plannerStats.currentWeekNumber} Active
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-3">
          {weeklyDistribution.map((item) => {
            const isCurrent = plannerStats.currentWeekNumber === item.week;
            return (
              <div
                key={item.week}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[140px] transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Week {item.week}
                </span>

                {/* Vertical Visual Bar */}
                <div className="w-6 h-20 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex flex-col justify-end p-0.5 my-1">
                  <div
                    className={`w-full rounded-full transition-all duration-700 ${
                      item.percentage === 100
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-indigo-600'
                        : 'bg-indigo-400 dark:bg-indigo-500'
                    }`}
                    style={{ height: `${Math.max(8, item.percentage)}%` }}
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {item.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {item.done}/{item.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
