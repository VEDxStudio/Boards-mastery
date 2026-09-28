import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Chapter,
  Subject,
  UserProgressData,
  GlobalFilterState,
  ChapterStatus,
  ResourceAttachment,
  DailyTodoItem,
} from '../types';
import { CBSE_SYLLABUS, getAllChapters } from '../data/cbseSyllabusData';
import {
  loadUserData,
  saveUserData,
  createInitialData,
  recordActivity,
  generateAutoPlanSchedule,
  validateBackup,
} from '../services/storage';

export type TabType =
  | 'home'
  | 'syllabus'
  | 'planner'
  | 'revision'
  | 'pyq'
  | 'competency'
  | 'resources'
  | 'analytics'
  | 'settings';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  userData: UserProgressData;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  
  // Chapter Checkpoint & Metadata updates
  toggleCheckpoint: (chapterId: string, checkpoint: 'theory' | 'revision' | 'pyq' | 'competency') => void;
  updateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  attachResourceToChapter: (chapterId: string, resource: ResourceAttachment) => void;
  removeResourceFromChapter: (chapterId: string, resourceId: string) => void;

  // Planner actions
  updateStudyPlan: (startDate: string, targetDate: string) => void;
  assignChapterToWeek: (chapterId: string, week: number | undefined) => void;
  generateAutoPlan: () => void;
  
  // Reset & Backup
  resetAllProgress: () => void;
  importUserData: (importedJson: any, mode: 'merge' | 'replace') => { success: boolean; error?: string };

  // Daily To-Do List Management
  dailyTodos: DailyTodoItem[];
  addDailyTodo: (todo: Omit<DailyTodoItem, 'id' | 'createdAt'>) => void;
  toggleDailyTodo: (id: string) => void;
  deleteDailyTodo: (id: string) => void;
  clearCompletedDailyTodos: () => void;
  addSyllabusTaskToDailyTodo: (title: string, subjectId?: string, chapterId?: string) => void;

  // Filters & Search
  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  resetFilters: () => void;

  // Modals & Navigation
  activeChapterModalId: string | null;
  openChapterModal: (id: string) => void;
  closeChapterModal: () => void;
  
  assignWeekModalChapterId: string | null;
  openAssignWeekModal: (id: string) => void;
  closeAssignWeekModal: () => void;

  driveBrowserTargetChapterId: string | null;
  isDriveBrowserOpen: boolean;
  openDriveBrowser: (targetChapterId?: string) => void;
  closeDriveBrowser: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Calculated Stats
  overallStats: {
    totalChapters: number;
    masteredChapters: number;
    inProgressChapters: number;
    notStartedChapters: number;
    totalCheckpoints: number;
    completedCheckpoints: number;
    overallPercentage: number;
    theoryPercentage: number;
    revisionPercentage: number;
    pyqPercentage: number;
    competencyPercentage: number;
    revisionPendingCount: number;
    pyqPendingCount: number;
    competencyPendingCount: number;
  };

  subjectStats: Record<
    string,
    {
      subject: Subject;
      totalChapters: number;
      completedCheckpoints: number;
      totalCheckpoints: number;
      percentage: number;
      masteredCount: number;
      theoryDone: number;
      revisionDone: number;
      pyqDone: number;
      competencyDone: number;
    }
  >;

  plannerStats: {
    startDate: Date;
    targetDate: Date;
    totalDays: number;
    daysPassed: number;
    daysRemaining: number;
    currentWeekNumber: number;
    requiredDailyCheckpoints: number;
    requiredWeeklyCheckpoints: number;
    completionVelocity: number;
    status: 'On Track' | 'At Risk' | 'Behind';
    statusMessage: string;
  };

  nextRecommendedChapter: Chapter | null;
  todaysFocusTasks: Array<{
    id: string;
    chapter: Chapter;
    taskType: 'theory' | 'revision' | 'pyq' | 'competency';
    label: string;
    subjectName: string;
  }>;
}

const defaultFilters: GlobalFilterState = {
  searchQuery: '',
  selectedSubject: 'all',
  selectedStatus: 'all',
  selectedPriority: 'all',
  selectedAssessment: 'all',
  selectedWeek: 'all',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserProgressData>(() => loadUserData());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Theme resolution
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('board_mastery_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('board_mastery_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Filters
  const [filters, setFilters] = useState<GlobalFilterState>(defaultFilters);
  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  // Modals state
  const [activeChapterModalId, setActiveChapterModalId] = useState<string | null>(null);
  const [assignWeekModalChapterId, setAssignWeekModalChapterId] = useState<string | null>(null);
  const [isDriveBrowserOpen, setIsDriveBrowserOpen] = useState<boolean>(false);
  const [driveBrowserTargetChapterId, setDriveBrowserTargetChapterId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  // Toggle chapter checkpoint
  const toggleCheckpoint = useCallback(
    (chapterId: string, checkpoint: 'theory' | 'revision' | 'pyq' | 'competency') => {
      setUserData((prev) => {
        const currentCh = prev.chapters[chapterId];
        if (!currentCh) return prev;

        const newVal = !currentCh[checkpoint];
        const now = new Date().toISOString();

        const updatedCh: Chapter = {
          ...currentCh,
          [checkpoint]: newVal,
          lastStudied: now,
        };

        const totalBefore =
          (currentCh.theory ? 1 : 0) +
          (currentCh.revision ? 1 : 0) +
          (currentCh.pyq ? 1 : 0) +
          (currentCh.competency ? 1 : 0);

        const totalAfter =
          (updatedCh.theory ? 1 : 0) +
          (updatedCh.revision ? 1 : 0) +
          (updatedCh.pyq ? 1 : 0) +
          (updatedCh.competency ? 1 : 0);

        // Confetti celebration when completing all 4 checkpoints
        if (totalBefore < 4 && totalAfter === 4) {
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch (e) {
            // ignore
          }
          showToast(`🏆 Chapter Mastered: ${updatedCh.name}!`, 'success');
        } else if (newVal) {
          showToast(`Completed ${checkpoint.toUpperCase()} for ${updatedCh.name}`, 'info');
        }

        const newChapters = {
          ...prev.chapters,
          [chapterId]: updatedCh,
        };

        const updatedWithActivity = recordActivity(
          { ...prev, chapters: newChapters },
          chapterId,
          newVal
        );

        return updatedWithActivity;
      });
    },
    [showToast]
  );

  // Update chapter details (notes, priority, etc.)
  const updateChapter = useCallback((chapterId: string, updates: Partial<Chapter>) => {
    setUserData((prev) => {
      const current = prev.chapters[chapterId];
      if (!current) return prev;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...current,
            ...updates,
            lastStudied: updates.notes !== undefined ? new Date().toISOString() : current.lastStudied,
          },
        },
      };
    });
  }, []);

  // Attach a resource (local file or Google Drive)
  const attachResourceToChapter = useCallback((chapterId: string, resource: ResourceAttachment) => {
    setUserData((prev) => {
      const current = prev.chapters[chapterId];
      if (!current) return prev;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...current,
            resources: [...(current.resources || []), resource],
          },
        },
      };
    });
    showToast(`Attached resource "${resource.name}"`, 'success');
  }, [showToast]);

  // Remove a resource
  const removeResourceFromChapter = useCallback((chapterId: string, resourceId: string) => {
    setUserData((prev) => {
      const current = prev.chapters[chapterId];
      if (!current) return prev;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...current,
            resources: (current.resources || []).filter((r) => r.id !== resourceId),
          },
        },
      };
    });
    showToast('Resource removed', 'info');
  }, [showToast]);

  // Assign week to chapter
  const assignChapterToWeek = useCallback((chapterId: string, week: number | undefined) => {
    setUserData((prev) => {
      const current = prev.chapters[chapterId];
      if (!current) return prev;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...current,
            assignedWeek: week,
          },
        },
      };
    });
  }, []);

  // Update Study Plan
  const updateStudyPlan = useCallback((startDate: string, targetDate: string) => {
    setUserData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        startDate,
        targetDate,
      },
    }));
    showToast('Updated 8-week target dates', 'success');
  }, [showToast]);

  // Auto Plan distribution
  const generateAutoPlan = useCallback(() => {
    const allChapters = Object.values(userData.chapters);
    const newSchedule = generateAutoPlanSchedule(allChapters);

    setUserData((prev) => {
      const updatedChapters: Record<string, Chapter> = {};
      for (const [id, ch] of Object.entries(prev.chapters)) {
        updatedChapters[id] = {
          ...ch,
          assignedWeek: newSchedule[id] || 1,
        };
      }
      return {
        ...prev,
        chapters: updatedChapters,
      };
    });
    showToast('✨ 8-Week completion schedule generated successfully!', 'success');
  }, [userData.chapters, showToast]);

  // Reset all progress
  const resetAllProgress = useCallback(() => {
    const initial = createInitialData();
    setUserData(initial);
    saveUserData(initial);
    showToast('All progress has been reset.', 'info');
  }, [showToast]);

  // Import JSON backup
  const importUserData = useCallback(
    (importedJson: any, mode: 'merge' | 'replace'): { success: boolean; error?: string } => {
      const validation = validateBackup(importedJson);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid backup file', 'error');
        return { success: false, error: validation.error };
      }

      setUserData((prev) => {
        if (mode === 'replace') {
          return {
            ...importedJson,
            lastActiveDate: new Date().toISOString().split('T')[0],
          };
        } else {
          // Merge mode: keep existing if missing, update with imported chapters
          const mergedChapters = { ...prev.chapters };
          for (const [id, ch] of Object.entries(importedJson.chapters as Record<string, Chapter>)) {
            if (mergedChapters[id]) {
              mergedChapters[id] = {
                ...mergedChapters[id],
                theory: ch.theory || mergedChapters[id].theory,
                revision: ch.revision || mergedChapters[id].revision,
                pyq: ch.pyq || mergedChapters[id].pyq,
                competency: ch.competency || mergedChapters[id].competency,
                notes: ch.notes || mergedChapters[id].notes,
                priority: ch.priority || mergedChapters[id].priority,
                assignedWeek: ch.assignedWeek || mergedChapters[id].assignedWeek,
                resources: [...(mergedChapters[id].resources || []), ...(ch.resources || [])],
              };
            } else {
              mergedChapters[id] = ch;
            }
          }
          return {
            ...prev,
            chapters: mergedChapters,
            plan: importedJson.plan || prev.plan,
          };
        }
      });

      showToast(`Backup ${mode === 'replace' ? 'restored' : 'merged'} successfully!`, 'success');
      return { success: true };
    },
    [showToast]
  );

  // Daily To-Do Callbacks
  const dailyTodos = useMemo(() => userData.dailyTodos || [], [userData.dailyTodos]);

  const addDailyTodo = useCallback((newTodo: Omit<DailyTodoItem, 'id' | 'createdAt'>) => {
    setUserData((prev) => {
      const todoItem: DailyTodoItem = {
        ...newTodo,
        id: `todo-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        dailyTodos: [todoItem, ...(prev.dailyTodos || [])],
      };
    });
    showToast('Task added to Daily To-Do', 'success');
  }, [showToast]);

  const toggleDailyTodo = useCallback((id: string) => {
    setUserData((prev) => {
      const currentList = prev.dailyTodos || [];
      const updated = currentList.map((t) => {
        if (t.id === id) {
          const nextVal = !t.completed;
          if (nextVal) {
            try {
              confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
            } catch (e) {}
          }
          return { ...t, completed: nextVal };
        }
        return t;
      });
      return { ...prev, dailyTodos: updated };
    });
  }, []);

  const deleteDailyTodo = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      dailyTodos: (prev.dailyTodos || []).filter((t) => t.id !== id),
    }));
    showToast('Task removed from To-Do', 'info');
  }, [showToast]);

  const clearCompletedDailyTodos = useCallback(() => {
    setUserData((prev) => {
      const remaining = (prev.dailyTodos || []).filter((t) => !t.completed);
      return { ...prev, dailyTodos: remaining };
    });
    showToast('Cleared completed tasks', 'info');
  }, [showToast]);

  const addSyllabusTaskToDailyTodo = useCallback((title: string, subjectId?: string, chapterId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    addDailyTodo({
      title,
      completed: false,
      subjectId: subjectId || 'general',
      chapterId,
      priority: 'high',
      estimatedMinutes: 30,
      dueDate: today,
    });
  }, [addDailyTodo]);

  // Modal openers
  const openChapterModal = useCallback((id: string) => setActiveChapterModalId(id), []);
  const closeChapterModal = useCallback(() => setActiveChapterModalId(null), []);

  const openAssignWeekModal = useCallback((id: string) => setAssignWeekModalChapterId(id), []);
  const closeAssignWeekModal = useCallback(() => setAssignWeekModalChapterId(null), []);

  const openDriveBrowser = useCallback((targetChapterId?: string) => {
    setDriveBrowserTargetChapterId(targetChapterId || null);
    setIsDriveBrowserOpen(true);
  }, []);
  const closeDriveBrowser = useCallback(() => {
    setIsDriveBrowserOpen(false);
    setDriveBrowserTargetChapterId(null);
  }, []);

  // === CALCULATED METRICS ===
  const chaptersList = useMemo(() => Object.values(userData.chapters), [userData.chapters]);

  // Overall Stats
  const overallStats = useMemo(() => {
    const totalChapters = chaptersList.length;
    let masteredChapters = 0;
    let inProgressChapters = 0;
    let notStartedChapters = 0;

    let theoryCount = 0;
    let revisionCount = 0;
    let pyqCount = 0;
    let competencyCount = 0;

    let revisionPendingCount = 0;
    let pyqPendingCount = 0;
    let competencyPendingCount = 0;

    for (const ch of chaptersList) {
      const doneCount = (ch.theory ? 1 : 0) + (ch.revision ? 1 : 0) + (ch.pyq ? 1 : 0) + (ch.competency ? 1 : 0);

      if (doneCount === 4) masteredChapters++;
      else if (doneCount > 0) inProgressChapters++;
      else notStartedChapters++;

      if (ch.theory) theoryCount++;
      if (ch.revision) revisionCount++;
      if (ch.pyq) pyqCount++;
      if (ch.competency) competencyCount++;

      // Waiting for revision: Theory is done, but Revision is not
      if (ch.theory && !ch.revision) revisionPendingCount++;
      // Pending PYQ: PYQ is not done
      if (!ch.pyq) pyqPendingCount++;
      // Pending Competency: Competency is not done
      if (!ch.competency) competencyPendingCount++;
    }

    const totalCheckpoints = totalChapters * 4;
    const completedCheckpoints = theoryCount + revisionCount + pyqCount + competencyCount;
    const overallPercentage = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

    return {
      totalChapters,
      masteredChapters,
      inProgressChapters,
      notStartedChapters,
      totalCheckpoints,
      completedCheckpoints,
      overallPercentage,
      theoryPercentage: totalChapters > 0 ? Math.round((theoryCount / totalChapters) * 100) : 0,
      revisionPercentage: totalChapters > 0 ? Math.round((revisionCount / totalChapters) * 100) : 0,
      pyqPercentage: totalChapters > 0 ? Math.round((pyqCount / totalChapters) * 100) : 0,
      competencyPercentage: totalChapters > 0 ? Math.round((competencyCount / totalChapters) * 100) : 0,
      revisionPendingCount,
      pyqPendingCount,
      competencyPendingCount,
    };
  }, [chaptersList]);

  // Subject Stats
  const subjectStats = useMemo(() => {
    const stats: Record<string, any> = {};

    for (const subject of CBSE_SYLLABUS) {
      const subjectChapters = chaptersList.filter((c) => c.subjectId === subject.id);
      const totalChapters = subjectChapters.length;
      let theoryDone = 0;
      let revisionDone = 0;
      let pyqDone = 0;
      let competencyDone = 0;
      let masteredCount = 0;

      for (const ch of subjectChapters) {
        if (ch.theory) theoryDone++;
        if (ch.revision) revisionDone++;
        if (ch.pyq) pyqDone++;
        if (ch.competency) competencyDone++;
        if (ch.theory && ch.revision && ch.pyq && ch.competency) masteredCount++;
      }

      const totalCheckpoints = totalChapters * 4;
      const completedCheckpoints = theoryDone + revisionDone + pyqDone + competencyDone;
      const percentage = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

      stats[subject.id] = {
        subject,
        totalChapters,
        completedCheckpoints,
        totalCheckpoints,
        percentage,
        masteredCount,
        theoryDone,
        revisionDone,
        pyqDone,
        competencyDone,
      };
    }
    return stats;
  }, [chaptersList]);

  // Planner Stats & Deadline Logic
  const plannerStats = useMemo(() => {
    const start = new Date(userData.plan.startDate || '2026-09-01');
    const target = new Date(userData.plan.targetDate || '2026-10-27');
    const now = new Date();

    const msPerDay = 1000 * 3600 * 24;
    const totalDays = Math.max(1, Math.round((target.getTime() - start.getTime()) / msPerDay));
    const daysPassed = Math.max(0, Math.round((now.getTime() - start.getTime()) / msPerDay));
    const daysRemaining = Math.max(0, Math.round((target.getTime() - now.getTime()) / msPerDay));

    const currentWeekNumber = Math.min(8, Math.max(1, Math.floor(daysPassed / 7) + 1));

    const totalCheckpoints = chaptersList.length * 4;
    const completedCheckpoints = overallStats.completedCheckpoints;
    const remainingCheckpoints = totalCheckpoints - completedCheckpoints;

    const requiredDailyCheckpoints = daysRemaining > 0 ? Number((remainingCheckpoints / daysRemaining).toFixed(1)) : remainingCheckpoints;
    const requiredWeeklyCheckpoints = Math.ceil(requiredDailyCheckpoints * 7);

    // Target checkpoint progress by current week
    const targetCheckpointsByNow = (totalCheckpoints / 8) * currentWeekNumber;
    const checkpointDiff = completedCheckpoints - targetCheckpointsByNow;

    let status: 'On Track' | 'At Risk' | 'Behind' = 'On Track';
    let statusMessage = '';

    if (daysRemaining === 0 && completedCheckpoints < totalCheckpoints) {
      status = 'Behind';
      statusMessage = 'Target deadline reached. Focus on high-weightage chapters to wrap up.';
    } else if (checkpointDiff >= -5) {
      status = 'On Track';
      statusMessage = `You are on pace! Complete ~${requiredWeeklyCheckpoints} checkpoints this week to stay on target.`;
    } else if (checkpointDiff >= -15) {
      status = 'At Risk';
      statusMessage = `You need approximately ${Math.max(2, Math.ceil(requiredDailyCheckpoints))} checkpoints per day to catch up smoothly.`;
    } else {
      status = 'Behind';
      statusMessage = `Pacing gap detected. Aim for ${requiredWeeklyCheckpoints} checkpoints this week, focusing first on high-priority theory.`;
    }

    return {
      startDate: start,
      targetDate: target,
      totalDays,
      daysPassed,
      daysRemaining,
      currentWeekNumber,
      requiredDailyCheckpoints,
      requiredWeeklyCheckpoints,
      completionVelocity: completedCheckpoints,
      status,
      statusMessage,
    };
  }, [userData.plan, chaptersList.length, overallStats.completedCheckpoints]);

  // Smart "What Should I Study Next?" recommendation
  const nextRecommendedChapter = useMemo(() => {
    // Priority order:
    // 1. Incomplete theory in current or earlier assigned week
    // 2. High priority
    // 3. Subject balance (alternating subjects)
    const incompleteTheoryChapters = chaptersList.filter((c) => !c.theory);
    if (incompleteTheoryChapters.length === 0) {
      // If all theory is done, look for revision pending
      const needRevision = chaptersList.filter((c) => c.theory && !c.revision);
      if (needRevision.length > 0) return needRevision[0];
      // Otherwise need PYQs
      const needPyq = chaptersList.filter((c) => !c.pyq);
      if (needPyq.length > 0) return needPyq[0];
      return null;
    }

    // Sort by priority (high > medium > low), then by assignedWeek
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sorted = [...incompleteTheoryChapters].sort((a, b) => {
      const weekA = a.assignedWeek || 10;
      const weekB = b.assignedWeek || 10;
      if (weekA !== weekB) return weekA - weekB;
      const pA = priorityWeight[a.priority || 'medium'];
      const pB = priorityWeight[b.priority || 'medium'];
      return pB - pA;
    });

    return sorted[0] || null;
  }, [chaptersList]);

  // Today's Focus Recommended Tasks (3 to 5 actionable tasks)
  const todaysFocusTasks = useMemo(() => {
    const tasks: Array<{
      id: string;
      chapter: Chapter;
      taskType: 'theory' | 'revision' | 'pyq' | 'competency';
      label: string;
      subjectName: string;
    }> = [];

    const getSubjectName = (subId: string) => {
      const s = CBSE_SYLLABUS.find((item) => item.id === subId);
      return s ? s.name : subId;
    };

    // 1. Up to 2 high-priority theory chapters
    const pendingTheory = chaptersList.filter((c) => !c.theory && c.priority === 'high');
    for (let i = 0; i < Math.min(2, pendingTheory.length); i++) {
      const ch = pendingTheory[i];
      tasks.push({
        id: `${ch.id}-theory`,
        chapter: ch,
        taskType: 'theory',
        label: `Complete Theory: ${ch.name}`,
        subjectName: getSubjectName(ch.subjectId),
      });
    }

    // 2. One chapter waiting for revision
    const pendingRevision = chaptersList.filter((c) => c.theory && !c.revision);
    if (pendingRevision.length > 0) {
      const ch = pendingRevision[0];
      tasks.push({
        id: `${ch.id}-revision`,
        chapter: ch,
        taskType: 'revision',
        label: `Revise: ${ch.name}`,
        subjectName: getSubjectName(ch.subjectId),
      });
    }

    // 3. One PYQ solving task
    const pendingPyq = chaptersList.filter((c) => c.theory && !c.pyq);
    if (pendingPyq.length > 0) {
      const ch = pendingPyq[0];
      tasks.push({
        id: `${ch.id}-pyq`,
        chapter: ch,
        taskType: 'pyq',
        label: `Solve PYQs: ${ch.name}`,
        subjectName: getSubjectName(ch.subjectId),
      });
    }

    // 4. One Competency task
    const pendingComp = chaptersList.filter((c) => c.theory && !c.competency);
    if (pendingComp.length > 0 && tasks.length < 5) {
      const ch = pendingComp[0];
      tasks.push({
        id: `${ch.id}-comp`,
        chapter: ch,
        taskType: 'competency',
        label: `Practice Competency: ${ch.name}`,
        subjectName: getSubjectName(ch.subjectId),
      });
    }

    return tasks;
  }, [chaptersList]);

  return (
    <AppContext.Provider
      value={{
        userData,
        theme,
        setTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        toggleCheckpoint,
        updateChapter,
        attachResourceToChapter,
        removeResourceFromChapter,
        updateStudyPlan,
        assignChapterToWeek,
        generateAutoPlan,
        resetAllProgress,
        importUserData,
        filters,
        setFilters,
        resetFilters,
        activeChapterModalId,
        openChapterModal,
        closeChapterModal,
        assignWeekModalChapterId,
        openAssignWeekModal,
        closeAssignWeekModal,
        driveBrowserTargetChapterId,
        isDriveBrowserOpen,
        openDriveBrowser,
        closeDriveBrowser,
        toasts,
        showToast,
        removeToast,
        overallStats,
        subjectStats,
        plannerStats,
        nextRecommendedChapter,
        todaysFocusTasks,
        dailyTodos,
        addDailyTodo,
        toggleDailyTodo,
        deleteDailyTodo,
        clearCompletedDailyTodos,
        addSyllabusTaskToDailyTodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
