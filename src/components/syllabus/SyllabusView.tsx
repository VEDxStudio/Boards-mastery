import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { ChapterCard } from './ChapterCard';
import { FilterSearchBar } from './FilterSearchBar';
import { ChapterDetailModal } from './ChapterDetailModal';
import { AssignWeekModal } from '../planner/AssignWeekModal';
import { GoogleDriveBrowserModal } from '../resources/GoogleDriveBrowserModal';
import { Calculator, Atom, Globe, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const SyllabusView: React.FC = () => {
  const {
    userData,
    filters,
    selectedSubjectId,
    setSelectedSubjectId,
    subjectStats,
  } = useApp();

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      case 'Atom':
        return <Atom className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  // Filter logic
  const filteredSubjects = useMemo(() => {
    const query = filters.searchQuery.toLowerCase().trim();

    return CBSE_SYLLABUS.map((subject) => {
      // Check subject filter
      if (filters.selectedSubject !== 'all' && filters.selectedSubject !== subject.id) {
        return null;
      }
      if (selectedSubjectId && selectedSubjectId !== subject.id && filters.selectedSubject === 'all') {
        return null;
      }

      // Filter sections and chapters
      const matchingSections = subject.sections
        .map((section) => {
          const matchingChapters = section.chapters
            .map((originalCh) => userData.chapters[originalCh.id] || originalCh)
            .filter((ch) => {
              // 1. Search Query
              if (query) {
                const inName = ch.name.toLowerCase().includes(query);
                const inNotes = (ch.notes || '').toLowerCase().includes(query);
                const inSection = ch.section.toLowerCase().includes(query);
                const inSubtopics = (ch.subtopics || []).some((st) =>
                  st.toLowerCase().includes(query)
                );
                if (!inName && !inNotes && !inSection && !inSubtopics) return false;
              }

              // 2. Status filter
              const completedCount =
                (ch.theory ? 1 : 0) +
                (ch.revision ? 1 : 0) +
                (ch.pyq ? 1 : 0) +
                (ch.competency ? 1 : 0);
              const status =
                completedCount === 4
                  ? 'mastered'
                  : completedCount > 0
                  ? 'in_progress'
                  : 'not_started';

              if (filters.selectedStatus !== 'all' && status !== filters.selectedStatus) {
                return false;
              }

              // 3. Priority filter
              if (filters.selectedPriority !== 'all' && ch.priority !== filters.selectedPriority) {
                return false;
              }

              // 4. Assessment filter
              if (
                filters.selectedAssessment !== 'all' &&
                ch.assessmentType !== filters.selectedAssessment
              ) {
                return false;
              }

              // 5. Queues toggles
              if (filters.onlyRevisionPending && (!ch.theory || ch.revision)) {
                return false;
              }
              if (filters.onlyPyqPending && ch.pyq) {
                return false;
              }
              if (filters.onlyCompetencyPending && ch.competency) {
                return false;
              }

              return true;
            });

          return {
            ...section,
            chapters: matchingChapters,
          };
        })
        .filter((sec) => sec.chapters.length > 0);

      if (matchingSections.length === 0) return null;

      return {
        ...subject,
        sections: matchingSections,
      };
    }).filter(Boolean);
  }, [filters, selectedSubjectId, userData.chapters]);

  const totalFilteredChaptersCount = useMemo(() => {
    let count = 0;
    for (const sub of filteredSubjects) {
      if (!sub) continue;
      for (const sec of sub.sections) {
        count += sec.chapters.length;
      }
    }
    return count;
  }, [filteredSubjects]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Modals */}
      <ChapterDetailModal />
      <AssignWeekModal />
      <GoogleDriveBrowserModal />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Class 10 CBSE Syllabus
            </h1>
            {selectedSubjectId && (
              <button
                onClick={() => setSelectedSubjectId(null)}
                className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Show All
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Class X 2026–27 Official Course Structure with 4 Independent Checkpoints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {totalFilteredChaptersCount} Chapters Shown
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterSearchBar />

      {/* Subject Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSelectedSubjectId(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedSubjectId === null
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All 4 Subjects</span>
        </button>

        {CBSE_SYLLABUS.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const stats = subjectStats[sub.id];

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{getSubjectIcon(sub.iconName)}</span>
              <span>{sub.name}</span>
              {stats && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {stats.percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subjects & Units List */}
      {filteredSubjects.length > 0 ? (
        <div className="space-y-10">
          {filteredSubjects.map((subject) => {
            if (!subject) return null;
            const stats = subjectStats[subject.id];

            return (
              <div key={subject.id} className="space-y-6">
                {/* Subject Header Banner */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl ${subject.colorScheme.light}`}>
                      {getSubjectIcon(subject.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                          {subject.name}
                        </h2>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {subject.totalMarks} Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Code {subject.code} · {stats?.masteredCount || 0} of {stats?.totalChapters || 0} chapters fully mastered
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-56 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Subject Mastery</span>
                      <span>{stats?.percentage || 0}%</span>
                    </div>
                    <ProgressBar
                      progress={stats?.percentage || 0}
                      heightClass="h-2.5"
                      colorClass={subject.colorScheme.dark}
                    />
                  </div>
                </div>

                {/* Sections & Units inside Subject */}
                <div className="space-y-6 pl-0 sm:pl-2">
                  {subject.sections.map((section) => (
                    <div key={section.id} className="space-y-3">
                      {/* Section Title Bar */}
                      <div className="flex items-center justify-between gap-2 px-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                              {section.title}
                            </h3>
                            {section.marks !== undefined && section.marks > 0 && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                                {section.marks} Marks
                              </span>
                            )}
                          </div>
                          {section.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-4 mt-0.5">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-semibold shrink-0">
                          {section.chapters.length} chapter(s)
                        </span>
                      </div>

                      {/* Chapters Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {section.chapters.map((chapter) => (
                          <ChapterCard key={chapter.id} chapter={chapter} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            No Chapters Match Your Filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, or clear active status/priority filters to see syllabus chapters.
          </p>
          <button
            onClick={() => {
              setSelectedSubjectId(null);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
