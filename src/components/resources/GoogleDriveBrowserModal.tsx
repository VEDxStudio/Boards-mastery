import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { initAuth, googleSignIn, logout } from '../../services/auth';
import { listDriveFiles, createDriveTextFile, GoogleDriveFile } from '../../services/driveService';
import { User } from 'firebase/auth';
import {
  X,
  Search,
  FolderSync,
  FileText,
  Paperclip,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const GoogleDriveBrowserModal: React.FC = () => {
  const {
    isDriveBrowserOpen,
    closeDriveBrowser,
    driveBrowserTargetChapterId,
    attachResourceToChapter,
    userData,
    showToast,
  } = useApp();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);

  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'document' | 'image'>('all');

  // Quick note creation in drive state
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Selected file to attach
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [targetChapterId, setTargetChapterId] = useState<string>(driveBrowserTargetChapterId || '');

  // Confirm dialog state for actions
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (driveBrowserTargetChapterId) {
      setTargetChapterId(driveBrowserTargetChapterId);
    }
  }, [driveBrowserTargetChapterId]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when authenticated and modal open
  const fetchFiles = async () => {
    if (!token) return;
    setIsLoadingFiles(true);
    try {
      const driveFiles = await listDriveFiles(searchQuery, filterType);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      if (err.message && err.message.includes('401')) {
        setNeedsAuth(true);
      }
      showToast(err.message || 'Failed to fetch Drive files', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isDriveBrowserOpen && token) {
      fetchFiles();
    }
  }, [isDriveBrowserOpen, token, filterType]);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        showToast(`Connected as ${result.user.email}`, 'success');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast(err.message || 'Google Sign-in failed', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Disconnect Google Drive?',
      message: 'Are you sure you want to sign out? You will need to sign in again to browse and attach your Google Drive notes.',
      onConfirm: async () => {
        await logout();
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
        setFiles([]);
        setConfirmDialog((p) => ({ ...p, isOpen: false }));
        showToast('Signed out of Google Drive', 'info');
      },
    });
  };

  const handleAttachFile = (file: GoogleDriveFile) => {
    if (!targetChapterId) {
      showToast('Please select a target chapter to attach this file to.', 'warning');
      return;
    }

    const chapter = userData.chapters[targetChapterId];
    if (!chapter) return;

    attachResourceToChapter(targetChapterId, {
      id: `drive-${file.id}`,
      name: file.name,
      type: 'drive',
      driveFileId: file.id,
      driveWebViewLink: file.webViewLink,
      dateAdded: new Date().toISOString(),
    });

    closeDriveBrowser();
  };

  const handleCreateNoteInDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    setIsSavingNote(true);
    try {
      const created = await createDriveTextFile(newNoteTitle, newNoteContent);
      showToast(`Created "${created.name}" in Google Drive!`, 'success');
      setIsCreatingNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      await fetchFiles();

      // If target chapter is selected, automatically attach it
      if (targetChapterId) {
        attachResourceToChapter(targetChapterId, {
          id: `drive-${created.id}`,
          name: created.name,
          type: 'drive',
          driveFileId: created.id,
          driveWebViewLink: created.webViewLink,
          dateAdded: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create note in Google Drive', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  if (!isDriveBrowserOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                <FolderSync className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                  Google Drive Study Resources
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user ? `Connected as ${user.email}` : 'Attach notes and PYQs directly to chapters'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Disconnect Drive"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeDriveBrowser}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {needsAuth ? (
              /* Sign In with Google Prompt */
              <div className="text-center py-8 px-4 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <FolderSync className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Connect Google Drive
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Link your NCERT notes, PYQ question papers, and revision summaries from your Google Drive with permission from the app's users.
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleSignIn}
                    disabled={isLoggingIn}
                    className="gsi-material-button shadow-sm"
                  >
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          style={{ display: 'block' }}
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                          <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">
                        {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Authenticated View */
              <div className="space-y-4">
                {/* Target chapter selector */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1.5">
                  <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Attach Selected Drive File To:
                  </label>
                  <select
                    value={targetChapterId}
                    onChange={(e) => setTargetChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Chapter --</option>
                    {Object.values(userData.chapters).map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.subjectId.toUpperCase()}: Ch {ch.chapterNumber} - {ch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search & Filter toolbar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                      placeholder="Search Drive files..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="all">All Files</option>
                      <option value="pdf">PDFs only</option>
                      <option value="document">Docs / Sheets / TXT</option>
                      <option value="image">Images</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsCreatingNote(!isCreatingNote)}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Note</span>
                    </button>
                  </div>
                </div>

                {/* Create Note in Drive Drawer */}
                {isCreatingNote && (
                  <form
                    onSubmit={handleCreateNoteInDrive}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Create New Study Note in Google Drive
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNote(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note Title (e.g. Science - Chemical Equations Summary)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
                    />

                    <textarea
                      rows={3}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write your chapter formulas, definitions, key points..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                    />

                    <button
                      type="submit"
                      disabled={isSavingNote}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderSync className="w-4 h-4" />}
                      <span>Save & Link to Google Drive</span>
                    </button>
                  </form>
                )}

                {/* Files List */}
                {isLoadingFiles ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-xs">Searching your Google Drive...</span>
                  </div>
                ) : files.length > 0 ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {file.mimeType.split('.').pop() || 'Drive File'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                              title="View in Google Drive"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleAttachFile(file)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            Attach
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                    <p>No matching files found in your Google Drive.</p>
                    <p className="text-[11px] text-slate-500">
                      Use the "New Note" button above to create one right now, or upload study PDFs in your Drive.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={closeDriveBrowser}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
      />
    </>
  );
};
