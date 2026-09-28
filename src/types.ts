export type AssessmentType =
  | 'BOARD_EXAM'
  | 'FORMATIVE'
  | 'PROJECT'
  | 'MAP_WORK'
  | 'PERIODIC_ASSESSMENT'
  | 'INTERDISCIPLINARY';

export type Priority = 'low' | 'medium' | 'high';

export type ChapterStatus = 'not_started' | 'in_progress' | 'mastered';

export interface ResourceAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'sheet' | 'link' | 'drive' | 'txt' | 'other';
  url?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  sizeBytes?: number;
  dateAdded: string; // ISO date string
}

export interface Chapter {
  id: string;
  subjectId: string;
  section: string; // e.g. "Unit I: Number Systems" or "History" or "First Flight - Prose"
  chapterNumber: number | string;
  name: string;
  subtopics?: string[];
  unitMarks?: number;
  assessmentType: AssessmentType;
  assessmentNotes?: string;
  
  // The 4 Core Checkpoints (Independent)
  theory: boolean;
  revision: boolean;
  pyq: boolean;
  competency: boolean;

  // Additional Chapter Metadata
  priority: Priority;
  notes: string;
  resources: ResourceAttachment[];
  assignedWeek?: number; // 1 to 8
  targetDate?: string; // YYYY-MM-DD
  lastStudied?: string; // ISO date string

  // PYQ & Competency Specific metrics
  pyqQuestionsSolved?: number;
  pyqMistakes?: string;
  competencyAttempted?: number;
  competencyCorrect?: number;
  competencyMistakes?: string;
}

export interface Section {
  id: string;
  title: string;
  marks?: number;
  description?: string;
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  totalMarks: number;
  iconName: string;
  colorScheme: {
    primary: string;
    light: string;
    dark: string;
    badge: string;
    border: string;
  };
  sections: Section[];
}

export interface StudyPlan {
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  totalWeeks: number; // default 8
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  checkpointsCompleted: number;
  chaptersUpdated: string[];
}

export interface DailyTodoItem {
  id: string;
  title: string;
  completed: boolean;
  subjectId?: string; // 'mathematics' | 'science' | 'social-science' | 'english' | 'general'
  chapterId?: string;
  estimatedMinutes?: number;
  priority?: Priority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO
}

export interface UserProgressData {
  version: string;
  plan: StudyPlan;
  chapters: Record<string, Chapter>;
  history: DailyActivityRecord[];
  streak: number;
  lastActiveDate: string;
  theme: 'light' | 'dark' | 'system';
  dailyTodos?: DailyTodoItem[];
}

export interface GlobalFilterState {
  searchQuery: string;
  selectedSubject: string | 'all';
  selectedStatus: ChapterStatus | 'all';
  selectedPriority: Priority | 'all';
  selectedAssessment: AssessmentType | 'all';
  onlyRevisionPending?: boolean;
  onlyPyqPending?: boolean;
  onlyCompetencyPending?: boolean;
  selectedWeek?: number | 'all';
}
