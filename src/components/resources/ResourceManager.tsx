import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceAttachment, Chapter } from '../../types';
import { GoogleDriveBrowserModal } from './GoogleDriveBrowserModal';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  FolderOpen,
  FolderSync,
  Upload,
  Paperclip,
  ExternalLink,
  Trash2,
  FileText,
  AlertTriangle,
  HardDrive,
  Search,
} from 'lucide-react';

export const ResourceManager: React.FC = () => {
  const {
    userData,
    openDriveBrowser,
    removeResourceFromChapter,
    openChapterModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    chapterId: string;
    resourceId: string;
    resourceName: string;
  }>({
    isOpen: false,
    chapterId: '',
    resourceId: '',
    resourceName: '',
  });

  // Collect all attached resources with chapter metadata
  const allResources = useMemo(() => {
    const list: Array<{ resource: ResourceAttachment; chapter: Chapter }> = [];
    for (const ch of Object.values(userData.chapters)) {
      if (ch.resources && ch.resources.length > 0) {
        for (const res of ch.resources) {
          list.push({ resource: res, chapter: ch });
        }
      }
    }
    return list;
  }, [userData.chapters]);

  const filteredResources = useMemo(() => {
    return allResources.filter(({ resource, chapter }) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = resource.name.toLowerCase().includes(q);
        const matchesChapter = chapter.name.toLowerCase().includes(q);
        if (!matchesName && !matchesChapter) return false;
      }
      if (selectedType !== 'all') {
        if (selectedType === 'drive' && resource.type !== 'drive') return false;
        if (selectedType === 'pdf' && resource.type !== 'pdf') return false;
        if (selectedType === 'image' && resource.type !== 'image') return false;
        if (selectedType === 'doc' && resource.type !== 'doc' && resource.type !== 'sheet' && resource.type !== 'txt')
          return false;
      }
      return true;
    });
  }, [allResources, searchQuery, selectedType]);

  const handleDeleteResource = () => {
    removeResourceFromChapter(deleteConfirm.chapterId, deleteConfirm.resourceId);
    setDeleteConfirm({ isOpen: false, chapterId: '', resourceId: '', resourceName: '' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <GoogleDriveBrowserModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Study Files & Resources
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {allResources.length} Linked Files
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Central repository for your notes, formula sheets, NCERT solutions, and Google Drive links
          </p>
        </div>

        <button
          onClick={() => openDriveBrowser()}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <FolderSync className="w-4 h-4" />
          <span>Browse Google Drive</span>
        </button>
      </div>

      {/* Google Drive Integration Spotlight */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
              Google Workspace Drive
            </span>
          </div>
          <h3 className="text-lg font-black text-white">
            Unlimited Cloud Storage for Notes & PYQs
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            Attach question papers, topper answer sheets, and diagrams directly from your Google Drive. Files stay safely stored in your cloud with permission from the app's users.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => openDriveBrowser()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-950 font-bold text-xs shadow-sm transition-all"
          >
            Connect / Open Drive
          </button>
        </div>
      </div>

      {/* Storage limitation notice */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2.5">
        <HardDrive className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          <strong>Storage notice:</strong> Local uploaded files are stored in browser storage (approx 5MB per file limit). For larger multi-page PDFs and guides, prefer linking directly via <strong>Google Drive</strong>.
        </span>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search file name or chapter..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'drive', 'pdf', 'image', 'doc'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                selectedType === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Types' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(({ resource, chapter }) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-indigo-600 dark:text-indigo-400 shrink-0">
                    {resource.type === 'drive' ? (
                      <FolderSync className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Paperclip className="w-5 h-5" />
                    )}
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {resource.type}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {resource.name}
                  </h4>
                  <p
                    onClick={() => openChapterModal(chapter.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline mt-1 truncate"
                  >
                    {chapter.subjectId.toUpperCase()}: {chapter.name}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {new Date(resource.dateAdded).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  {resource.driveWebViewLink || resource.url ? (
                    <a
                      href={resource.driveWebViewLink || resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Open Resource"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : null}

                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        isOpen: true,
                        chapterId: chapter.id,
                        resourceId: resource.id,
                        resourceName: resource.name,
                      })
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                    title="Delete Resource Attachment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            No Study Files Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Attach notes and past question papers directly to chapters or browse your Google Drive.
          </p>
          <button
            onClick={() => openDriveBrowser()}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Attach from Google Drive
          </button>
        </div>
      )}

      {/* Confirmation Modal for Resource Deletion (Mandatory for Workspace guidelines) */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Remove Attached Resource?"
        message={`Are you sure you want to remove "${deleteConfirm.resourceName}" from this chapter's study resources? This cannot be undone.`}
        confirmLabel="Remove File"
        isDestructive={true}
        onConfirm={handleDeleteResource}
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, chapterId: '', resourceId: '', resourceName: '' })
        }
      />
    </div>
  );
};
