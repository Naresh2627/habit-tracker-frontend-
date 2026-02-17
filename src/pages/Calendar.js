import React, { useState, useEffect, useCallback } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  X,
  Trash2
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfToday
} from 'date-fns';

const Calendar = () => {
  const { habits } = useHabits();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthProgress, setMonthProgress] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState('all');
  const [loading, setLoading] = useState(false);

  const isPastDate = selectedDate && selectedDate < startOfToday();

  // Get calendar days for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for calendar grid
  const startDay = monthStart.getDay(); // 0 = Sunday
  const paddingDays = Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDay - i));
    return date;
  });

  const allDays = [...paddingDays, ...calendarDays];

  // Fetch progress data for the current month using API
  const fetchMonthProgress = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-indexed

      const data = await api.progress.getCalendar(
        year,
        month,
        selectedHabit !== 'all' ? selectedHabit : null
      );

      setMonthProgress(data || []);
    } catch (error) {
      console.error('Error fetching month progress:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate, selectedHabit, user]);

  useEffect(() => {
    fetchMonthProgress();
  }, [fetchMonthProgress]);

  // Get progress for a specific date
  const getDateProgress = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return monthProgress.filter(p => p.date === dateString);
  };

  // Get completion status for a date
  const getDateStatus = (date) => {
    const progress = getDateProgress(date);
    if (progress.length === 0) return 'none';

    const completed = progress.filter(p => p.completed).length;
    const total = progress.length;

    if (completed === 0) return 'missed';
    if (completed === total) return 'complete';
    return 'partial';
  };

  // Navigate months
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Handle date click
  const handleDateClick = (date) => {
    if (!isSameMonth(date, currentDate)) return;
    setSelectedDate(date);
  };

  // Get selected date progress details
  const selectedDateProgress = selectedDate ? getDateProgress(selectedDate) : [];

  // Toggle habit completion for selected date using API
  const toggleHabitForDate = async (habitId, date) => {
    if (!user) return;

    try {
      const dateString = format(date, 'yyyy-MM-dd');

      await api.progress.toggle({
        habitId,
        date: dateString
      });

      // Refresh data
      await fetchMonthProgress();
    } catch (error) {
      console.error('Error toggling habit:', error);
      // You might want to add a toast notification here if you have a toast system
      // toast.error('Failed to update habit');
    }
  };

  // Remove habit progress for selected date
  const handleRemoveHabit = async (progressId) => {
    if (!user) return;

    try {
      await api.progress.delete(progressId);
      // Refresh data
      await fetchMonthProgress();
    } catch (error) {
      console.error('Error removing habit:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar View
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your habit completion history
          </p>
        </div>

        {/* Habit Filter */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="input w-48"
          >
            <option value="all">All Habits</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.emoji} {habit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>

              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            )}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {allDays.map((date, index) => {
                const status = getDateStatus(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!isCurrentMonth}
                    className={`
                      p-2 h-12 text-sm rounded-lg transition-all duration-200 relative
                      ${!isCurrentMonth
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      }
                      ${isSelected
                        ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : ''
                      }
                      ${isTodayDate
                        ? 'font-bold text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-white'
                      }
                    `}
                  >
                    <span className="relative z-10">{format(date, 'd')}</span>

                    {/* Status indicator */}
                    {isCurrentMonth && status !== 'none' && (
                      <div className={`
                        absolute inset-0 rounded-lg opacity-30
                        ${status === 'complete' ? 'bg-green-500' : ''}
                        ${status === 'partial' ? 'bg-yellow-500' : ''}
                        ${status === 'missed' ? 'bg-red-500' : ''}
                      `} />
                    )}

                    {/* Completion dots */}
                    {isCurrentMonth && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                        {getDateProgress(date).slice(0, 3).map((progress, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${progress.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                          />
                        ))}
                        {getDateProgress(date).length > 3 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400">
                            <span className="text-xs">+</span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 opacity-30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">All Complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 opacity-30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Partial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 opacity-30 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Missed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {selectedDate ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedDateProgress.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No habits tracked on this date
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateProgress.map((progress) => (
                    <div
                      key={progress.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{progress.habits?.emoji}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {progress.habits?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {progress.habits?.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleHabitForDate(progress.habit_id, selectedDate)}
                          className={`p-1 ${isPastDate ? 'cursor-not-allowed opacity-50' : ''}`}
                          disabled={isPastDate}
                          title={isPastDate ? "Cannot edit past records" : (progress.completed ? "Mark as incomplete" : "Mark as complete")}
                        >
                          {progress.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                          )}
                        </button>

                        {!isPastDate && (
                          <button
                            onClick={() => handleRemoveHabit(progress.id)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove from this date"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add habits section removed as per user request */}
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Date
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Click on any date to view and edit your habit progress
                </p>
              </div>
            </div>
          )}

          {/* Monthly Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Days</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {calendarDays.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Days with Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Set(monthProgress.map(p => p.date)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Completions</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {monthProgress.filter(p => p.completed).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;