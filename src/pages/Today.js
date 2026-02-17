import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Today = () => {
  const { todayProgress, loading, toggleHabitCompletion } = useHabits();

  const handleToggle = async (habitId) => {
    await toggleHabitCompletion(habitId);
  };

  const completedCount = todayProgress.filter(item => item.completed).length;
  const totalCount = todayProgress.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Today's Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <Link
          to="/habits"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Habit</span>
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Daily Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {completedCount} of {totalCount} habits completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {completionRate}%
            </div>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {todayProgress.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Circle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first habit to start building better routines.
            </p>
            <Link
              to="/habits"
              className="btn btn-primary"
            >
              Create Your First Habit
            </Link>
          </div>
        ) : (
          todayProgress.map((item) => (
            <div
              key={item.habit.id}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                item.completed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleToggle(item.habit.id)}
            >
              <div className="flex items-center space-x-4">
                <button className="flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <Circle className="h-8 w-8 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.habit.emoji}</span>
                    <div>
                      <h3 className={`text-lg font-medium ${
                        item.completed 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.habit.name}
                      </h3>
                      {item.habit.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.habit.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.habit.current_streak}
                    </div>
                    <div>Current</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.habit.longest_streak}
                    </div>
                    <div>Best</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Motivational Message */}
      {todayProgress.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
          <div className="text-center">
            {completionRate === 100 ? (
              <>
                <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">
                  🎉 Perfect Day!
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  You've completed all your habits today. Keep up the amazing work!
                </p>
              </>
            ) : completionRate >= 75 ? (
              <>
                <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">
                  🔥 Great Progress!
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  You're doing fantastic! Just a few more habits to complete your day.
                </p>
              </>
            ) : completionRate >= 50 ? (
              <>
                <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">
                  💪 Keep Going!
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  You're halfway there! Every habit completed is a step forward.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">
                  🌱 Start Strong!
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  Every journey begins with a single step. You've got this!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Today;