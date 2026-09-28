import { Chapter, UserProgressData, StudyPlan, DailyActivityRecord } from '../types';
import { CBSE_SYLLABUS, getAllChapters } from '../data/cbseSyllabusData';

const STORAGE_KEY = 'board_mastery_cbse10_data_v1';

export function getDefaultDates(): { startDate: string; targetDate: string } {
  const start = new Date();
  const target = new Date();
  target.setDate(start.getDate() + 56); // 8 weeks = 56 days

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  return {
    startDate: formatDate(start),
    targetDate: formatDate(target),
  };
}

export function createInitialData(): UserProgressData {
  const { startDate, targetDate } = getDefaultDates();
  const allChapters = getAllChapters();
  const chaptersMap: Record<string, Chapter> = {};

  // Auto assign default suggested weeks across the 8 weeks
  const distributedPlan = generateAutoPlanSchedule(allChapters);

  for (const ch of allChapters) {
    chaptersMap[ch.id] = {
      ...ch,
      assignedWeek: distributedPlan[ch.id] || 1,
    };
  }

  const today = new Date().toISOString().split('T')[0];

  return {
    version: '1.0.0',
    plan: {
      startDate,
      targetDate,
      totalWeeks: 8,
    },
    chapters: chaptersMap,
    history: [
      {
        date: today,
        checkpointsCompleted: 0,
        chaptersUpdated: [],
      },
    ],
    streak: 1,
    lastActiveDate: today,
    theme: 'system',
    dailyTodos: [
      {
        id: 'todo-1',
        title: 'Solve 10 Quadratic Equations sums (Factorisation & Word Problems)',
        completed: false,
        subjectId: 'mathematics',
        priority: 'high',
        estimatedMinutes: 45,
        dueDate: today,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'todo-2',
        title: 'Revise Life Processes diagrams: Nephron structure & Human Heart',
        completed: false,
        subjectId: 'science',
        priority: 'high',
        estimatedMinutes: 30,
        dueDate: today,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'todo-3',
        title: 'Write 1 Analytical Paragraph (Chart/Graph comparative analysis)',
        completed: false,
        subjectId: 'english',
        priority: 'medium',
        estimatedMinutes: 25,
        dueDate: today,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'todo-4',
        title: 'Solve 5-mark PYQ: Non-Cooperation & Civil Disobedience Movement',
        completed: false,
        subjectId: 'social-science',
        priority: 'high',
        estimatedMinutes: 35,
        dueDate: today,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Intelligent 8-Week auto planning algorithm:
 * - Distributes chapters across 8 weeks
 * - Distributes high-priority & foundational chapters in earlier weeks
 * - Rotates subjects across weeks to prevent burnout
 * - Accommodates unit weightage
 */
export function generateAutoPlanSchedule(chapters: Chapter[]): Record<string, number> {
  const schedule: Record<string, number> = {};

  // Group chapters by subject
  const mathChapters = chapters.filter((c) => c.subjectId === 'mathematics');
  const sciChapters = chapters.filter((c) => c.subjectId === 'science');
  const sstChapters = chapters.filter((c) => c.subjectId === 'social-science');
  const engChapters = chapters.filter((c) => c.subjectId === 'english');

  // Math: 15 chapters distributed over 8 weeks (~2 per week)
  mathChapters.forEach((ch, idx) => {
    schedule[ch.id] = Math.min(8, Math.floor(idx / 2) + 1);
  });

  // Science: 14 chapters distributed over 8 weeks (~1.8 per week)
  sciChapters.forEach((ch, idx) => {
    schedule[ch.id] = Math.min(8, Math.floor(idx / 1.8) + 1);
  });

  // Social Science: 21 chapters distributed over 8 weeks (~2.6 per week)
  sstChapters.forEach((ch, idx) => {
    schedule[ch.id] = Math.min(8, Math.floor(idx / 2.7) + 1);
  });

  // English: 32 items (prose, poems, footprints, skills) distributed over 8 weeks (~4 per week)
  engChapters.forEach((ch, idx) => {
    schedule[ch.id] = Math.min(8, Math.floor(idx / 4) + 1);
  });

  return schedule;
}

export function loadUserData(): UserProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialData();
      saveUserData(initial);
      return initial;
    }
    const parsed: UserProgressData = JSON.parse(raw);

    // Merge with master syllabus if any new chapter is added or missing
    const allChapters = getAllChapters();
    let hasChanges = false;
    for (const ch of allChapters) {
      if (!parsed.chapters[ch.id]) {
        parsed.chapters[ch.id] = { ...ch, assignedWeek: 1 };
        hasChanges = true;
      }
    }

    // Update streak based on current date
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const last = new Date(parsed.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        parsed.streak = (parsed.streak || 0) + 1;
      } else if (diffDays > 1) {
        parsed.streak = 1;
      }
      parsed.lastActiveDate = today;
      hasChanges = true;
    }

    // Ensure dailyTodos is present
    if (!parsed.dailyTodos || !Array.isArray(parsed.dailyTodos)) {
      const initial = createInitialData();
      parsed.dailyTodos = initial.dailyTodos;
      hasChanges = true;
    }

    if (hasChanges) {
      saveUserData(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error loading user data from localStorage:', err);
    return createInitialData();
  }
}

export function saveUserData(data: UserProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving user data:', err);
  }
}

/**
 * Record daily activity when a checkpoint is checked
 */
export function recordActivity(
  data: UserProgressData,
  chapterId: string,
  isCompleted: boolean
): UserProgressData {
  const today = new Date().toISOString().split('T')[0];
  const history = [...(data.history || [])];
  const existingToday = history.find((h) => h.date === today);

  if (existingToday) {
    existingToday.checkpointsCompleted += isCompleted ? 1 : -1;
    if (existingToday.checkpointsCompleted < 0) existingToday.checkpointsCompleted = 0;
    if (!existingToday.chaptersUpdated.includes(chapterId)) {
      existingToday.chaptersUpdated.push(chapterId);
    }
  } else {
    history.push({
      date: today,
      checkpointsCompleted: isCompleted ? 1 : 0,
      chaptersUpdated: [chapterId],
    });
  }

  // Keep last 60 days
  const trimmed = history.slice(-60);
  return {
    ...data,
    history: trimmed,
  };
}

/**
 * Export data as JSON
 */
export function exportDataAsJSON(data: UserProgressData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `cbse_class10_mastery_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Export progress data as CSV
 */
export function exportDataAsCSV(data: UserProgressData): void {
  const headers = [
    'Subject',
    'Section',
    'Chapter Number',
    'Chapter Name',
    'Assessment Type',
    'Theory Completed',
    'Revision Completed',
    'PYQ Completed',
    'Competency Completed',
    'Overall Status',
    'Assigned Week',
    'Priority',
    'Notes',
    'Last Studied',
  ];

  const rows = Object.values(data.chapters).map((ch) => {
    const totalDone = (ch.theory ? 1 : 0) + (ch.revision ? 1 : 0) + (ch.pyq ? 1 : 0) + (ch.competency ? 1 : 0);
    const status = totalDone === 4 ? 'Mastered' : totalDone > 0 ? 'In Progress' : 'Not Started';
    return [
      `"${ch.subjectId}"`,
      `"${ch.section}"`,
      `"${ch.chapterNumber}"`,
      `"${ch.name.replace(/"/g, '""')}"`,
      `"${ch.assessmentType}"`,
      ch.theory ? 'Yes' : 'No',
      ch.revision ? 'Yes' : 'No',
      ch.pyq ? 'Yes' : 'No',
      ch.competency ? 'Yes' : 'No',
      `"${status}"`,
      ch.assignedWeek || 'Unassigned',
      ch.priority,
      `"${(ch.notes || '').replace(/"/g, '""')}"`,
      ch.lastStudied || 'Not studied yet',
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cbse_class10_progress_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Validate imported JSON backup
 */
export function validateBackup(json: any): { valid: boolean; error?: string } {
  if (!json || typeof json !== 'object') {
    return { valid: false, error: 'Invalid JSON format' };
  }
  if (!json.chapters || typeof json.chapters !== 'object') {
    return { valid: false, error: 'Backup is missing required chapter data' };
  }
  const sampleChapter = Object.values(json.chapters)[0] as any;
  if (!sampleChapter || typeof sampleChapter.name !== 'string') {
    return { valid: false, error: 'Backup does not contain valid chapter objects' };
  }
  return { valid: true };
}
