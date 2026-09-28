import React from 'react';
import { useApp } from '../../context/AppContext';
import { OverallProgressCard } from './OverallProgressCard';
import { DailyTodoDashboard } from './DailyTodoDashboard';
import { SubjectCards } from './SubjectCards';
import { WhatNextCard } from './WhatNextCard';
import { TodaysFocusCard } from './TodaysFocusCard';
import { OnboardingModal } from './OnboardingModal';
import { Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { plannerStats, overallStats, setActiveTab } = useApp();

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      <OnboardingModal />

      {/* Hero Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedToday}</span>
            <span>•</span>
            <span>Week {plannerStats.currentWeekNumber} of 8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Board Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Your 8-week journey to syllabus completion and exam excellence.
          </p>
        </div>

        {/* Pacing status badge with constructive guidance */}
        <div
          className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 shrink-0 ${
            plannerStats.status === 'On Track'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : plannerStats.status === 'At Risk'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-current shrink-0 animate-ping opacity-75" />
          <div>
            <span className="font-extrabold uppercase tracking-wide block text-[11px]">
              Pacing: {plannerStats.status}
            </span>
            <span className="text-xs opacity-90">{plannerStats.statusMessage}</span>
          </div>
        </div>
      </div>

      {/* Central Overall Progress Card */}
      <OverallProgressCard />

      {/* Daily To-Do Dashboard Card */}
      <DailyTodoDashboard />

      {/* Smart Next Recommendation & Today's Quick Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WhatNextCard />
        </div>
        <div className="lg:col-span-2">
          <TodaysFocusCard />
        </div>
      </div>

      {/* 4 Core Subject Cards */}
      <SubjectCards />
    </div>
  );
};
