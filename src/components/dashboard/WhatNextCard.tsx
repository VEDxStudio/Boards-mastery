import React from 'react';
import { useApp } from '../../context/AppContext';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { Sparkles, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { PriorityBadge, AssessmentBadge } from '../common/Badge';

export const WhatNextCard: React.FC = () => {
  const { nextRecommendedChapter, openChapterModal, setSelectedSubjectId, setActiveTab } = useApp();

  if (!nextRecommendedChapter) {
    return (
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-5 sm:p-6 text-center">
        <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Incredible! All Theory Checkpoints Complete!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
          You have finished theory across the entire Class 10 CBSE syllabus. Focus on the Revision Queue and solve PYQs to solidify board exam mastery.
        </p>
        <button
          onClick={() => setActiveTab('revision')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
        >
          Open Revision Queue
        </button>
      </div>
    );
  }

  const subject = CBSE_SYLLABUS.find((s) => s.id === nextRecommendedChapter.subjectId);
  const reasonText = !nextRecommendedChapter.theory
    ? 'Theory incomplete · High foundational weightage'
    : !nextRecommendedChapter.revision
    ? 'Theory completed · Waiting for first revision'
    : 'Ready for PYQ & Competency practice';

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-extrabold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-indigo-300" />
              What Should I Study Next?
            </span>
            <span className="text-xs text-indigo-300/80 font-medium">
              {subject?.name} · {nextRecommendedChapter.section}
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {nextRecommendedChapter.name}
            </h3>
            <p className="text-xs text-indigo-200/90 mt-0.5">
              {reasonText}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <PriorityBadge priority={nextRecommendedChapter.priority} />
            <AssessmentBadge type={nextRecommendedChapter.assessmentType} />
            {nextRecommendedChapter.assignedWeek && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/90 font-medium">
                Week {nextRecommendedChapter.assignedWeek}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => openChapterModal(nextRecommendedChapter.id)}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Continue Chapter</span>
            <ArrowRight className="w-4 h-4 text-indigo-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
