import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyTodoItem, Priority } from '../../types';
import { CBSE_SYLLABUS } from '../../data/cbseSyllabusData';
import { ProgressBar } from '../common/ProgressBar';
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Clock,
  Tag,
  AlertCircle,
  Calendar,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const DailyTodoDashboard: React.FC = () => {
  const {
    dailyTodos,
    addDailyTodo,
    toggleDailyTodo,
    deleteDailyTodo,
    clearCompletedDailyTodos,
    addSyllabusTaskToDailyTodo,
    todaysFocusTasks,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('mathematics');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('high');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(30);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddingExpanded, setIsAddingExpanded] = useState(false);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const totalCount = dailyTodos.length;
  const completedCount = dailyTodos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = useMemo(() => {
    if (filterMode === 'pending') return dailyTodos.filter((t) => !t.completed);
    if (filterMode === 'completed') return dailyTodos.filter((t) => t.completed);
    return dailyTodos;
  }, [dailyTodos, filterMode]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addDailyTodo({
      title: newTitle.trim(),
      completed: false,
      subjectId: selectedSubject,
      priority: selectedPriority,
      estimatedMinutes: selectedMinutes,
      dueDate: new Date().toISOString().split('T')[0],
    });

    setNewTitle('');
    setIsAddingExpanded(false);
  };

  const getSubjectColor = (subjectId?: string) => {
    switch (subjectId) {
      case 'mathematics':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'science':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'social-science':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'english':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getSubjectLabel = (subjectId?: string) => {
    switch (subjectId) {
      case 'mathematics':
        return 'Math';
      case 'science':
        return 'Science';
      case 'social-science':
        return 'SST';
      case 'english':
        return 'English';
      default:
        return 'General';
    }
  };

  // Quick suggestions from todaysFocusTasks that are not already in dailyTodos
  const quickSuggestions = useMemo(() => {
    const existingTitles = new Set(dailyTodos.map((t) => t.title.toLowerCase()));
    return todaysFocusTasks
      .filter((task) => !existingTitles.has(task.label.toLowerCase()))
      .slice(0, 3);
  }, [dailyTodos, todaysFocusTasks]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header with Title, Progress, and Clear button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Daily Study To-Do List
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {todayStr}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal daily action items to stay on track for your 8-week target
            </p>
          </div>
        </div>

        {/* Completion Progress Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {totalCount} completed
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              {completionPercentage}% daily target
            </div>
          </div>
          <div className="w-16">
            <ProgressBar
              progress={completionPercentage}
              heightClass="h-2"
              colorClass={completionPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddSubmit} className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onFocus={() => setIsAddingExpanded(true)}
              placeholder="What do you need to study today? (e.g., Solve 10 Trigonometry sums...)"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Expandable options for Subject, Priority & Study Time */}
        {isAddingExpanded && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center gap-2">
              {/* Subject Tag */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Subject:</span>
                {[
                  { id: 'mathematics', label: 'Math' },
                  { id: 'science', label: 'Science' },
                  { id: 'social-science', label: 'SST' },
                  { id: 'english', label: 'English' },
                  { id: 'general', label: 'General' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedSubject === sub.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1 ml-2">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Priority:</span>
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition-all ${
                      selectedPriority === p
                        ? p === 'high'
                          ? 'bg-red-500 text-white'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-1 ml-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <select
                  value={selectedMinutes}
                  onChange={(e) => setSelectedMinutes(parseInt(e.target.value, 10))}
                  className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hrs</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingExpanded(false)}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Hide options
            </button>
          </div>
        )}
      </form>

      {/* Quick Suggestions from Syllabus */}
      {quickSuggestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Suggested:</span>
          </span>
          {quickSuggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                addSyllabusTaskToDailyTodo(item.label, item.chapter.subjectId, item.chapter.id)
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800 text-[11px] font-semibold text-indigo-800 dark:text-indigo-200 shrink-0 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs and Batch Actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'pending'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <button
            onClick={clearCompletedDailyTodos}
            className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Todo Items List */}
      <div className="space-y-2 pt-1">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => {
            return (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 group ${
                  todo.completed
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Custom Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => toggleDailyTodo(todo.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      todo.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 text-transparent'
                    }`}
                    aria-label={`Toggle ${todo.title}`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getSubjectColor(
                          todo.subjectId
                        )}`}
                      >
                        {getSubjectLabel(todo.subjectId)}
                      </span>

                      {todo.priority && todo.priority === 'high' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="High Priority" />
                      )}

                      {todo.estimatedMinutes && (
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{todo.estimatedMinutes}m</span>
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        todo.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {todo.title}
                    </p>
                  </div>
                </div>

                {/* Delete action */}
                <button
                  type="button"
                  onClick={() => deleteDailyTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-opacity rounded-lg ml-2"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-1">
            {filterMode === 'completed' ? (
              <p>No completed tasks yet. Check off items above as you finish them!</p>
            ) : filterMode === 'pending' ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                🎉 All pending daily study tasks completed! Fantastic job!
              </p>
            ) : (
              <p>No tasks on your daily to-do list. Add your study goals for today above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
