import React from 'react';
import { useApp } from '../../context/AppContext';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { ChapterStatus, Priority, AssessmentType } from '../../types';

export const FilterSearchBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useApp();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedSubject !== 'all' ||
    filters.selectedStatus !== 'all' ||
    filters.selectedPriority !== 'all' ||
    filters.selectedAssessment !== 'all' ||
    filters.onlyRevisionPending ||
    filters.onlyPyqPending ||
    filters.onlyCompetencyPending;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearch}
          placeholder="Search by chapter title, NCERT topic, formula, subtopic or keyword..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Subject Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilters((p) => ({ ...p, selectedSubject: 'all' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.selectedSubject === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>

          {CBSE_SYLLABUS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setFilters((p) => ({ ...p, selectedSubject: sub.id }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filters.selectedSubject === sub.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Action Queues Quick Toggles */}
        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

        <button
          onClick={() =>
            setFilters((p) => ({ ...p, onlyRevisionPending: !p.onlyRevisionPending }))
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filters.onlyRevisionPending
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
          }`}
        >
          Revision Pending
        </button>

        <button
          onClick={() => setFilters((p) => ({ ...p, onlyPyqPending: !p.onlyPyqPending }))}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filters.onlyPyqPending
              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
          }`}
        >
          PYQ Pending
        </button>

        <button
          onClick={() =>
            setFilters((p) => ({ ...p, onlyCompetencyPending: !p.onlyCompetencyPending }))
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filters.onlyCompetencyPending
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
        >
          Competency Pending
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Secondary dropdown row: Status, Priority, Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <select
            value={filters.selectedStatus}
            onChange={(e) =>
              setFilters((p) => ({ ...p, selectedStatus: e.target.value as ChapterStatus | 'all' }))
            }
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Status: All</option>
            <option value="mastered">Mastered (4/4)</option>
            <option value="in_progress">In Progress (1-3/4)</option>
            <option value="not_started">Not Started (0/4)</option>
          </select>
        </div>

        <div>
          <select
            value={filters.selectedPriority}
            onChange={(e) =>
              setFilters((p) => ({ ...p, selectedPriority: e.target.value as Priority | 'all' }))
            }
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Priority: All</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <select
            value={filters.selectedAssessment}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                selectedAssessment: e.target.value as AssessmentType | 'all',
              }))
            }
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Assessment: All</option>
            <option value="BOARD_EXAM">Board Exam (Year-End)</option>
            <option value="PERIODIC_ASSESSMENT">Periodic Assessment Only</option>
            <option value="PROJECT">Project Work</option>
            <option value="MAP_WORK">Map Work Focus</option>
          </select>
        </div>
      </div>
    </div>
  );
};
