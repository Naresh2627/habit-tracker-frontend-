import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { Plus, Edit, Trash2, Target, X } from 'lucide-react';

const Habits = () => {
  const { habits, loading, createHabit, updateHabit, deleteHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '✅',
    category: 'General',
    color: '#3B82F6'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      emoji: '✅',
      category: 'General',
      color: '#3B82F6'
    });
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      emoji: habit.emoji || '✅',
      category: habit.category || 'General',
      color: habit.color || '#3B82F6'
    });
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editingHabit) {
      result = await updateHabit(editingHabit.id, formData);
    } else {
      result = await createHabit(formData);
    }

    if (result.data) {
      resetForm();
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId);
    }
  };

  if (loading && habits.length === 0) {
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
            My Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your daily habits and routines
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Habit</span>
          </button>
        )}
      </div>

      {/* Create/Edit Habit Form */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Drink 8 glasses of water"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Health, Fitness, Learning"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                className="input"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add more details about this habit..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="✅"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="h-10 w-10 p-0 border-0 rounded cursor-pointer"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="submit" className="btn btn-primary">
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 && !loading ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Target className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No habits created yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building better routines by creating your first habit.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: `${habit.color}20` }}
                  >
                    {habit.emoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2" style={{ color: habit.color }}>•</span>
                      {habit.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs px-2">
                        {habit.category}
                      </span>
                      <span>Current: {habit.current_streak} days</span>
                      <span>Best: {habit.longest_streak} days</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Edit Habit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete Habit"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {habit.description && (
                <div className="mt-3 ml-16 text-sm text-gray-500 dark:text-gray-400">
                  {habit.description}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Habits;