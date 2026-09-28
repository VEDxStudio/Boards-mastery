import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter, Priority, ResourceAttachment } from '../../types';
import {
  X,
  Check,
  Calendar,
  Clock,
  Paperclip,
  FileText,
  FolderSync,
  Upload,
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { AssessmentBadge, PriorityBadge, StatusBadge } from '../common/Badge';

export const ChapterDetailModal: React.FC = () => {
  const {
    activeChapterModalId,
    closeChapterModal,
    userData,
    toggleCheckpoint,
    updateChapter,
    attachResourceToChapter,
    removeResourceFromChapter,
    openDriveBrowser,
    assignChapterToWeek,
    showToast,
  } = useApp();

  const [localNote, setLocalNote] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  if (!activeChapterModalId) return null;

  const chapter: Chapter | undefined = userData.chapters[activeChapterModalId];
  if (!chapter) return null;

  const handleNotesBlur = () => {
    updateChapter(chapter.id, { notes: localNote });
  };

  // Local file upload attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB for local storage safety
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB. For larger notes, use Google Drive.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: ResourceAttachment['type'] = 'other';
      if (ext === 'pdf') type = 'pdf';
      else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) type = 'image';
      else if (['doc', 'docx'].includes(ext || '')) type = 'doc';
      else if (['xls', 'xlsx'].includes(ext || '')) type = 'sheet';
      else if (ext === 'txt') type = 'txt';

      const newResource: ResourceAttachment = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type,
        url: dataUrl,
        sizeBytes: file.size,
        dateAdded: new Date().toISOString(),
      };

      attachResourceToChapter(chapter.id, newResource);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const completedCount =
    (chapter.theory ? 1 : 0) +
    (chapter.revision ? 1 : 0) +
    (chapter.pyq ? 1 : 0) +
    (chapter.competency ? 1 : 0);

  const status =
    completedCount === 4 ? 'mastered' : completedCount > 0 ? 'in_progress' : 'not_started';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Ch {chapter.chapterNumber}
              </span>
              <AssessmentBadge type={chapter.assessmentType} />
              <StatusBadge status={status} />
              {chapter.unitMarks !== undefined && chapter.unitMarks > 0 && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Weightage: ~{chapter.unitMarks} marks
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {chapter.name}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {chapter.section}
            </p>
          </div>

          <button
            onClick={closeChapterModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Assessment Official Note */}
          {chapter.assessmentNotes && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  CBSE Assessment Specification
                </span>
                <p className="leading-relaxed">{chapter.assessmentNotes}</p>
              </div>
            </div>
          )}

          {/* Core Mastery Checkpoints */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Mastery Checklist ({completedCount}/4 Completed)
              </h3>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {completedCount === 4 ? 'All Checkpoints Mastered' : `${4 - completedCount} Remaining`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Theory */}
              <button
                type="button"
                onClick={() => toggleCheckpoint(chapter.id, 'theory')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all min-h-[50px] ${
                  chapter.theory
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-left">
                  <span>Complete Theory</span>
                  <span className="block text-[11px] font-normal opacity-80">
                    NCERT concepts & diagrams
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    chapter.theory
                      ? 'bg-white/20 border-transparent text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>

              {/* Revision */}
              <button
                type="button"
                onClick={() => toggleCheckpoint(chapter.id, 'revision')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all min-h-[50px] ${
                  chapter.revision
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-left">
                  <span>Revise Key Notes</span>
                  <span className="block text-[11px] font-normal opacity-80">
                    Formulas, definitions & mindmaps
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    chapter.revision
                      ? 'bg-white/20 border-transparent text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>

              {/* PYQs */}
              <button
                type="button"
                onClick={() => toggleCheckpoint(chapter.id, 'pyq')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all min-h-[50px] ${
                  chapter.pyq
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-left">
                  <span>Solve PYQs</span>
                  <span className="block text-[11px] font-normal opacity-80">
                    5–10 years CBSE board questions
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    chapter.pyq
                      ? 'bg-white/20 border-transparent text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>

              {/* Competency */}
              <button
                type="button"
                onClick={() => toggleCheckpoint(chapter.id, 'competency')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all min-h-[50px] ${
                  chapter.competency
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-left">
                  <span>Competency Practice</span>
                  <span className="block text-[11px] font-normal opacity-80">
                    Assertion-Reason & Case-Based
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    chapter.competency
                      ? 'bg-white/20 border-transparent text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            </div>
          </div>

          {/* Subtopics Checklist / Breakdown */}
          {chapter.subtopics && chapter.subtopics.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Syllabus Topics & Key Concepts
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 divide-y divide-slate-200/50 dark:divide-slate-800 text-xs">
                {chapter.subtopics.map((topic, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority & Assigned Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Priority Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateChapter(chapter.id, { priority: p })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      chapter.priority === p
                        ? p === 'high'
                          ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
                          : p === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        : 'bg-white dark:bg-slate-800/40 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Planner Week (1 to 8)</span>
              </label>
              <select
                value={chapter.assignedWeek || ''}
                onChange={(e) =>
                  assignChapterToWeek(
                    chapter.id,
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">Unassigned</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>
                    Week {w} of 8
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Chapter Notes & Weak Areas</span>
              </label>
              <span className="text-[11px] text-slate-400">Autosaves on leave</span>
            </div>
            <textarea
              defaultValue={chapter.notes || ''}
              onChange={(e) => setLocalNote(e.target.value)}
              onBlur={handleNotesBlur}
              rows={3}
              placeholder="e.g., Memorize Thales theorem proof, Revise mirror formula sign conventions, Check Section 1.3 exceptions..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Study Resources & Google Drive Integration */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                <span>Study Resources & Files ({chapter.resources?.length || 0})</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Google Drive Connect button */}
                <button
                  type="button"
                  onClick={() => openDriveBrowser(chapter.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-colors"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  <span>Attach from Google Drive</span>
                </button>

                {/* Local Upload */}
                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                  />
                </label>
              </div>
            </div>

            {/* Resources list */}
            {chapter.resources && chapter.resources.length > 0 ? (
              <div className="space-y-2">
                {chapter.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                        {res.type === 'drive' ? (
                          <FolderSync className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Paperclip className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {res.name}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                          {res.type} · Added {new Date(res.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {res.driveWebViewLink || res.url ? (
                        <a
                          href={res.driveWebViewLink || res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Open Resource"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeResourceFromChapter(chapter.id, res.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                No files or Google Drive notes linked yet. Click above to attach formula sheets, PYQs or NCERT solutions.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {chapter.lastStudied
                ? `Last modified: ${new Date(chapter.lastStudied).toLocaleString()}`
                : 'Not started yet'}
            </span>
          </div>

          <button
            onClick={closeChapterModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
