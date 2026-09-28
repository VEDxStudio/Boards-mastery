import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Search, Sparkles, FolderSync, Flame, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    plannerStats,
    overallStats,
    userData,
    filters,
    setFilters,
    openDriveBrowser,
    setActiveTab,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Board Mastery
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                  CBSE 10
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                8-week journey to syllabus completion
              </p>
            </div>
          </div>
        </div>

        {/* Search bar on desktop or expanded mobile */}
        {isSearchOpen ? (
          <div className="flex-1 max-w-md mx-2 flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-indigo-500 animate-in fade-in duration-150">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              autoFocus
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search chapters, topics, notes..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
            />
            <button
              onClick={clearSearch}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 max-w-xs mx-4 relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search syllabus..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        )}

        {/* Right side stats & quick actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Days Left & Week Badge (Mobile + Desktop) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
              {plannerStats.daysRemaining}d left
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap hidden sm:inline">
              Week {plannerStats.currentWeekNumber} of 8
            </span>
            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap sm:hidden">
              W{plannerStats.currentWeekNumber}
            </span>
          </div>

          {/* Daily Streak */}
          <div
            title={`${userData.streak} day study streak!`}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{userData.streak || 1}</span>
          </div>

          {/* Search Button for Mobile */}
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Google Drive Connect button */}
          <button
            onClick={() => openDriveBrowser()}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            title="Google Drive Study Resources"
          >
            <FolderSync className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">Google Drive</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
