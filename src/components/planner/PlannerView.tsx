import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter } from '../../types';
import { ChapterCard } from '../syllabus/ChapterCard';
import { ChapterDetailModal } from '../syllabus/ChapterDetailModal';
import { AssignWeekModal } from './AssignWeekModal';
import { ProgressBar } from '../common/ProgressBar';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const {
    userData,
    plannerStats,
    generateAutoPlan,
    updateStudyPlan,
    openAssignWeekModal,
  } = useApp();

  const [startDate, setStartDate] = useState(userData.plan.startDate);
  const [targetDate, setTargetDate] = useState(userData.plan.targetDate);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudyPlan(startDate, targetDate);
  };

  // Group chapters by week (1 to 8, plus unassigned)
  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  const weeksData = useMemo(() => {
    const weeks: Array<{
      weekNumber: number;
      chapters: Chapter[];
      completedCount: number;
      totalCheckpoints: number;
      completedCheckpoints: number;
      progressPercentage: number;
      isCurrent: boolean;
    }> = [];

    for (let w = 1; w <= 8; w++) {
      const weekChapters = chaptersList.filter((c) => c.assignedWeek === w);
      let mastered = 0;
      let totalCp = weekChapters.length * 4;
      let doneCp = 0;

      for (const ch of weekChapters) {
        const count =
          (ch.theory ? 1 : 0) +
          (ch.revision ? 1 : 0) +
          (ch.pyq ? 1 : 0) +
          (ch.competency ? 1 : 0);
        doneCp += count;
        if (count === 4) mastered++;
      }

      const pct = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;

      weeks.push({
        weekNumber: w,
        chapters: weekChapters,
        completedCount: mastered,
        totalCheckpoints: totalCp,
        completedCheckpoints: doneCp,
        progressPercentage: pct,
        isCurrent: plannerStats.currentWeekNumber === w,
      });
    }

    return weeks;
  }, [chaptersList, plannerStats.currentWeekNumber]);

  const unassignedChapters = useMemo(
    () => chaptersList.filter((c) => !c.assignedWeek || c.assignedWeek < 1 || c.assignedWeek > 8),
    [chaptersList]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <ChapterDetailModal />
      <AssignWeekModal />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              8-Week Board Planner
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              56 Days Target
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Paced distribution across weeks with smart deadline tracking
          </p>
        </div>

        {/* Auto Planning button */}
        <button
          onClick={generateAutoPlan}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Auto-Generate 8-Week Plan</span>
        </button>
      </div>

      {/* Deadline pacing summary banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Time Remaining
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {plannerStats.daysRemaining}
            </span>
            <span className="text-xs text-slate-500">days left ({Math.ceil(plannerStats.daysRemaining / 7)} wks)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Currently in Week {plannerStats.currentWeekNumber} of 8
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Weekly Checkpoint Pace
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              ~{plannerStats.requiredWeeklyCheckpoints}
            </span>
            <span className="text-xs text-slate-500">milestones / wk</span>
          </div>
          <p className="text-[11px] text-slate-500">
            ~{plannerStats.requiredDailyCheckpoints} per day to finish on target
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pacing Status
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-black uppercase ${
                plannerStats.status === 'On Track'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : plannerStats.status === 'At Risk'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {plannerStats.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
            {plannerStats.statusMessage}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Target Dates
          </span>
          <form onSubmit={handleSaveDates} className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Target:</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                onBlur={() => updateStudyPlan(startDate, targetDate)}
                className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Week Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSelectedWeekFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedWeekFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          All 8 Weeks
        </button>

        {weeksData.map((w) => (
          <button
            key={w.weekNumber}
            onClick={() => setSelectedWeekFilter(w.weekNumber)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              selectedWeekFilter === w.weekNumber
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>Week {w.weekNumber}</span>
            {w.isCurrent && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Current Week" />
            )}
            <span
              className={`text-[10px] px-1 py-0.2 rounded ${
                selectedWeekFilter === w.weekNumber
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {w.progressPercentage}%
            </span>
          </button>
        ))}
      </div>

      {/* Weeks Grid */}
      <div className="space-y-8">
        {weeksData
          .filter((w) => selectedWeekFilter === 'all' || selectedWeekFilter === w.weekNumber)
          .map((week) => (
            <div
              key={week.weekNumber}
              className={`rounded-3xl p-5 sm:p-6 border transition-all ${
                week.isCurrent
                  ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Week Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                      week.isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        Week {week.weekNumber} Schedule
                      </h2>
                      {week.isCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          Current Week
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {week.chapters.length} planned chapters · {week.completedCount} fully mastered
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-48 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Weekly Target</span>
                    <span>{week.progressPercentage}%</span>
                  </div>
                  <ProgressBar
                    progress={week.progressPercentage}
                    heightClass="h-2"
                    colorClass={week.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}
                  />
                </div>
              </div>

              {/* Chapters List in Week */}
              <div className="mt-4">
                {week.chapters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {week.chapters.map((ch) => (
                      <ChapterCard key={ch.id} chapter={ch} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No chapters scheduled for Week {week.weekNumber}. Use "Assign to Week" on any chapter or click "Auto-Generate 8-Week Plan".
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Unassigned Chapters (if any) */}
        {unassignedChapters.length > 0 && selectedWeekFilter === 'all' && (
          <div className="rounded-3xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-amber-900 dark:text-amber-200">
                  Unassigned Chapters ({unassignedChapters.length})
                </h3>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                  Assign these chapters to an 8-week slot to make sure nothing is missed before the Board Exam.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {unassignedChapters.map((ch) => (
                <ChapterCard key={ch.id} chapter={ch} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
