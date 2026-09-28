import React from 'react';
import { AssessmentType, Priority, ChapterStatus } from '../../types';

interface AssessmentBadgeProps {
  type: AssessmentType;
  size?: 'sm' | 'md';
}

export const AssessmentBadge: React.FC<AssessmentBadgeProps> = ({ type, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wider' : 'px-2.5 py-1 text-xs';

  switch (type) {
    case 'BOARD_EXAM':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ${sizeClasses}`}
        >
          Board Exam
        </span>
      );
    case 'PERIODIC_ASSESSMENT':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-amber-300/80 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ${sizeClasses}`}
        >
          Periodic Only
        </span>
      );
    case 'PROJECT':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-purple-300/80 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300 ${sizeClasses}`}
        >
          Project Work
        </span>
      );
    case 'MAP_WORK':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-blue-300/80 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 ${sizeClasses}`}
        >
          Map Pointing
        </span>
      );
    case 'FORMATIVE':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${sizeClasses}`}
        >
          Formative
        </span>
      );
    case 'INTERDISCIPLINARY':
      return (
        <span
          className={`inline-flex items-center font-bold uppercase rounded-md border border-teal-300/80 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300 ${sizeClasses}`}
        >
          Interdisciplinary
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Medium
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: ChapterStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'mastered':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm">
          <span>✓</span>
          <span>Mastered</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span>In Progress</span>
        </span>
      );
    case 'not_started':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <span>Not Started</span>
        </span>
      );
  }
};
