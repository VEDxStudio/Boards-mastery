import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  RotateCcw,
  FileQuestion,
  Target,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, overallStats, plannerStats, dailyTodos } = useApp();

  const completedTodos = dailyTodos.filter((t) => t.completed).length;
  const totalTodos = dailyTodos.length;
  const todoPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const navItems: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'home',
      label: 'Home Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'syllabus',
      label: 'Syllabus & Mastery',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'planner',
      label: '8-Week Planner',
      icon: <Calendar className="w-5 h-5" />,
      badge: plannerStats.daysRemaining > 0 ? plannerStats.daysRemaining : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'revision',
      label: 'Revision Queue',
      icon: <RotateCcw className="w-5 h-5" />,
      badge: overallStats.revisionPendingCount > 0 ? overallStats.revisionPendingCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'pyq',
      label: 'PYQ Practice',
      icon: <FileQuestion className="w-5 h-5" />,
      badge: overallStats.pyqPendingCount > 0 ? overallStats.pyqPendingCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    },
    {
      id: 'competency',
      label: 'Competency Bank',
      icon: <Target className="w-5 h-5" />,
      badge: overallStats.competencyPendingCount > 0 ? overallStats.competencyPendingCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'resources',
      label: 'Study Files & Drive',
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings & Backup',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 shrink-0 overflow-y-auto">
      {/* Mini Progress Overview Card in Sidebar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-slate-600 dark:text-slate-300">Board Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              {overallStats.overallPercentage}%
            </span>
          </div>
          <ProgressBar progress={overallStats.overallPercentage} heightClass="h-2" />
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{overallStats.masteredChapters} mastered</span>
            <span>{overallStats.totalChapters - overallStats.masteredChapters} remaining</span>
          </div>
        </div>

        {/* Daily To-Do Summary Widget */}
        <div
          onClick={() => setActiveTab('home')}
          className="mt-2.5 cursor-pointer bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/60 transition-colors"
        >
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-slate-700 dark:text-slate-300">Today's To-Do</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              {completedTodos}/{totalTodos}
            </span>
          </div>
          <ProgressBar progress={todoPercentage} heightClass="h-1.5" colorClass="bg-emerald-500" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined ? (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-indigo-700/80 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'text-white/60 opacity-100' : 'text-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* 8-Week Cadence Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Class 10 CBSE 2026–27</span>
        </div>
      </div>
    </aside>
  );
};
