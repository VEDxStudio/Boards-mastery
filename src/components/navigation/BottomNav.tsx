import React, { useState } from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  RotateCcw,
  MoreHorizontal,
  FileQuestion,
  Target,
  FolderOpen,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, overallStats } = useApp();
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  const mainTabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'syllabus', label: 'Syllabus', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'planner', label: 'Planner', icon: <Calendar className="w-5 h-5" /> },
    {
      id: 'revision',
      label: 'Revision',
      icon: <RotateCcw className="w-5 h-5" />,
      badge: overallStats.revisionPendingCount > 0 ? overallStats.revisionPendingCount : undefined,
    },
  ];

  const moreTabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: number; description: string }> = [
    {
      id: 'pyq',
      label: 'PYQ Mastery',
      icon: <FileQuestion className="w-5 h-5 text-indigo-500" />,
      badge: overallStats.pyqPendingCount > 0 ? overallStats.pyqPendingCount : undefined,
      description: 'Past year questions tracking & question counts',
    },
    {
      id: 'competency',
      label: 'Competency',
      icon: <Target className="w-5 h-5 text-emerald-500" />,
      badge: overallStats.competencyPendingCount > 0 ? overallStats.competencyPendingCount : undefined,
      description: 'CBSE application & case-based question mastery',
    },
    {
      id: 'resources',
      label: 'Study Files & Drive',
      icon: <FolderOpen className="w-5 h-5 text-amber-500" />,
      description: 'Attached notes, PDFs, and Google Drive links',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
      description: 'Progress breakdown, subject rates & milestones',
    },
    {
      id: 'settings',
      label: 'Settings & Backup',
      icon: <Settings className="w-5 h-5 text-slate-500" />,
      description: 'Import/Export JSON, theme, dates and reset',
    },
  ];

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setIsMoreDrawerOpen(false);
  };

  const isMoreActive = ['pyq', 'competency', 'resources', 'analytics', 'settings'].includes(activeTab);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-black bg-rose-500 text-white rounded-full leading-tight shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreDrawerOpen(true)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 ${
              isMoreActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">More</span>
            {isMoreActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* More Drawer Bottom Sheet */}
      {isMoreDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl safe-bottom max-h-[85vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                All Sections & Tools
              </span>
              <button
                onClick={() => setIsMoreDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {moreTabs.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
