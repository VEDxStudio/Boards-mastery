import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportDataAsJSON, exportDataAsCSV } from '../../services/storage';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Settings,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Calendar,
  FileSpreadsheet,
  FileCode,
  Printer,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    userData,
    updateStudyPlan,
    resetAllProgress,
    importUserData,
    showToast,
  } = useApp();

  const [startDate, setStartDate] = useState(userData.plan.startDate);
  const [targetDate, setTargetDate] = useState(userData.plan.targetDate);

  // Import dialog state
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Reset dialog state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudyPlan(startDate, targetDate);
  };

  const handleExportJSON = () => {
    exportDataAsJSON(userData);
    showToast('JSON backup downloaded successfully', 'success');
  };

  const handleExportCSV = () => {
    exportDataAsCSV(userData);
    showToast('CSV progress spreadsheet downloaded', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setPendingImportData(parsed);
        setIsImportModalOpen(true);
      } catch (err) {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExecuteImport = (mode: 'merge' | 'replace') => {
    if (!pendingImportData) return;
    const res = importUserData(pendingImportData, mode);
    if (res.success) {
      setIsImportModalOpen(false);
      setPendingImportData(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings & Data Management
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            v1.0.0
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure schedule dates, appearance, import/export backups, and syllabus information
        </p>
      </div>

      {/* Appearance / Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Appearance Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle between modern crisp light mode and eye-friendly dark mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Dark Mode Active</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Light Mode Active</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8-Week Timeline Dates */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            8-Week Study Schedule Dates
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize your board preparation start date and final target completion deadline
          </p>
        </div>

        <form onSubmit={handleDatesSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Target Completion Date (56 Days Default)</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Update Target Dates
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Export / Import */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Backup & Data Portability
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your entire syllabus checkboxes, notes, and study plan to keep safe backups or transfer between devices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <FileCode className="w-4 h-4 text-indigo-500" />
            <span>Export JSON Backup</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV Spreadsheet</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Print Report View</span>
          </button>
        </div>

        {/* Import JSON Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Restore from Backup
            </span>
            <span className="text-[11px] text-slate-500">
              Upload a previously exported JSON backup file. Choose to Merge or Replace.
            </span>
          </div>

          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            <span>Import Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-3xl p-5 sm:p-6 border border-red-200 dark:border-red-900/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-base text-red-900 dark:text-red-300">
              Reset All Progress
            </h3>
            <p className="text-xs text-red-700/80 dark:text-red-400/80">
              Clears all checked theory, revision, PYQ, and competency checkpoints. Preserves the official Class 10 syllabus structure.
            </p>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            Reset Progress
          </button>
        </div>
      </div>

      {/* Official Syllabus Reference Info */}
      <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>About Class 10 CBSE 2026–27 Syllabus Data</span>
        </div>
        <p className="leading-relaxed">
          Preloaded with authentic syllabus specifications strictly matching the official CBSE Class X 2026–27 curriculum for Mathematics (Code 041), Science (Code 086), Social Science (Code 087), and English Language & Literature (Code 184). Assessment tags accurately represent Board Exam, Periodic Assessment, Formative, Project, and Map Work requirements.
        </p>
      </div>

      {/* Import Modal Dialog */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Backup Restore
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                How would you like to import?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose <strong>Merge</strong> to combine imported progress with your current checkpoints, or <strong>Replace</strong> to completely overwrite with the backup.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleExecuteImport('merge')}
                className="w-full p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/50 hover:bg-indigo-100 text-left transition-all"
              >
                <div className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  Merge with Existing Progress (Recommended)
                </div>
                <div className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-0.5">
                  Retains any completed checkpoints you already have and adds imported data.
                </div>
              </button>

              <button
                onClick={() => handleExecuteImport('replace')}
                className="w-full p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/50 hover:bg-amber-100 text-left transition-all"
              >
                <div className="font-bold text-sm text-amber-950 dark:text-amber-200">
                  Replace All Current Progress
                </div>
                <div className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  Overwrites your entire current state with the uploaded backup file.
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Syllabus Progress?"
        message="This will reset all your checked checkboxes (Theory, Revision, PYQ, Competency) back to zero. Your notes and syllabus chapters will remain intact. This action cannot be undone."
        confirmLabel="Yes, Reset Everything"
        isDestructive={true}
        onConfirm={() => {
          resetAllProgress();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
