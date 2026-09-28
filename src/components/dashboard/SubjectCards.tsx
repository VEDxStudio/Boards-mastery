import React from 'react';
import { useApp } from '../../context/AppContext';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { ProgressRing } from '../common/ProgressRing';
import { ProgressBar } from '../common/ProgressBar';
import { Calculator, Atom, Globe, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

export const SubjectCards: React.FC = () => {
  const { subjectStats, setSelectedSubjectId, setActiveTab } = useApp();

  const getIcon = (iconName: string) => {
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

  const handleOpenSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveTab('syllabus');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Subject Progress
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click any subject to view detailed unit & chapter checklists
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CBSE_SYLLABUS.map((subject) => {
          const stats = subjectStats[subject.id];
          if (!stats) return null;

          const remainingChapters = stats.totalChapters - stats.masteredCount;

          return (
            <div
              key={subject.id}
              onClick={() => handleOpenSubject(subject.id)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Progress Ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl ${subject.colorScheme.light} group-hover:scale-105 transition-transform`}
                    >
                      {getIcon(subject.iconName)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subject.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {subject.totalMarks} Marks · Code {subject.code}
                      </span>
                    </div>
                  </div>

                  <ProgressRing
                    progress={stats.percentage}
                    size={48}
                    strokeWidth={4.5}
                    colorClass={`text-${subject.colorScheme.primary}-600 dark:text-${subject.colorScheme.primary}-400`}
                  >
                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
                      {stats.percentage}%
                    </span>
                  </ProgressRing>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <ProgressBar
                    progress={stats.percentage}
                    heightClass="h-2"
                    colorClass={subject.colorScheme.dark}
                  />
                </div>

                {/* Chapter breakdown metrics */}
                <div className="mt-3.5 grid grid-cols-3 gap-1 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      {stats.masteredCount}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Mastered</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      {stats.totalChapters}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Total</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {remainingChapters}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Left</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700">
                <span>Continue Subject</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
