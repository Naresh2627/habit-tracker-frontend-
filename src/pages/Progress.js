import { useState, useEffect, useCallback } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Progress = () => {
  const { habits } = useHabits();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState('all');
  const [timeRange, setTimeRange] = useState(30);
  const [stats, setStats] = useState({
    completedDays: 0,
    totalDays: 0,
    completionRate: 0,
    missedDays: 0
  });
  const [recentProgress, setRecentProgress] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  // Fetch progress statistics using API
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const params = { days: timeRange };
      if (selectedHabit !== 'all') {
        params.habitId = selectedHabit;
      }

      const data = await api.progress.getStats(params);

      setStats({
        completedDays: data.completedDays,
        totalDays: data.totalDays,
        completionRate: data.completionRate,
        missedDays: data.missedDays
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    }
  }, [user, selectedHabit, timeRange]);

  // Fetch recent progress using API
  const fetchRecentProgress = useCallback(async () => {
    if (!user) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const params = {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      };

      if (selectedHabit !== 'all') {
        params.habitId = selectedHabit;
      }

      const progress = await api.progress.getAll(params);

      setRecentProgress(progress || []);

      // Process weekly data for chart
      const weeklyStats = processWeeklyData(progress || []);
      setWeeklyData(weeklyStats);
    } catch (error) {
      console.error('Error fetching recent progress:', error);
      toast.error('Failed to load recent progress');
    } finally {
      setLoading(false);
    }
  }, [user, selectedHabit]);

  // Process data for weekly chart
  const processWeeklyData = (progressData) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = days.map(day => ({ day, completed: 0, total: 0 }));

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();
      const dateString = format(date, 'yyyy-MM-dd');

      const dayProgress = progressData.filter(p => p.date === dateString);
      weekData[dayIndex].completed = dayProgress.filter(p => p.completed).length;
      weekData[dayIndex].total = dayProgress.length;
    }

    return weekData;
  };

  // Get completion rate color
  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Get habit color classes
  const getHabitColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentProgress();
    }
  }, [user, selectedHabit, timeRange, fetchStats, fetchRecentProgress]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Progress & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your habit progress and statistics
          </p>
        </div>
        <div className="card">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Progress & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your habit progress and statistics
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Habit
            </label>
            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Habits</option>
              {habits.map(habit => (
                <option key={habit.id} value={habit.id}>
                  {habit.emoji} {habit.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedDays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className={`text-2xl font-bold ${getCompletionColor(stats.completionRate)}`}>
                {stats.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-lg">✗</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Missed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.missedDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Progress
        </h3>
        <div className="flex items-end justify-between h-32 space-x-2">
          {weeklyData.map((day, index) => {
            const height = day.total > 0 ? (day.completed / day.total) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative h-24 flex items-end">
                  <div
                    className="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {day.day}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {day.completed}/{day.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Streaks */}
      {selectedHabit === 'all' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Habit Streaks
          </h3>
          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{habit.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{habit.name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHabitColorClasses(habit.color)}`}>
                      {habit.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {habit.current_streak || 0} days
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Best: {habit.longest_streak || 0} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        {recentProgress.length > 0 ? (
          <div className="space-y-2">
            {recentProgress.slice(0, 10).map((progress, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{progress.habits?.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {progress.habits?.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(progress.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {progress.completed ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No recent activity found
          </p>
        )}
      </div>
    </div>
  );
};

export default Progress;