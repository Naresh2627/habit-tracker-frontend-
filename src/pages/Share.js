import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Share = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shareableStats, setShareableStats] = useState(null);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shareForm, setShareForm] = useState({
    title: '',
    description: '',
    includeStats: true,
    includeHabits: true
  });

  // Fetch shareable stats
  const fetchShareableStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await api.share.getStats();
      setShareableStats(data);
    } catch (error) {
      console.error('Error fetching shareable stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch user's shared links
  const fetchSharedLinks = useCallback(async () => {
    if (!user) return;

    try {
      const data = await api.share.getUserLinks();
      setSharedLinks(data);
    } catch (error) {
      console.error('Error fetching shared links:', error);
    }
  }, [user]);

  // Create shareable link
  const createShareableLink = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const data = await api.share.createLink(shareForm);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success('Share link created and copied to clipboard!');
      
      // Reset form and refresh links
      setShareForm({
        title: '',
        description: '',
        includeStats: true,
        includeHabits: true
      });
      setShowCreateForm(false);
      fetchSharedLinks();

    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error(error.message || 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  // Delete shared link
  const deleteSharedLink = async (shareId) => {
    if (!user) return;

    try {
      await api.share.deleteLink(shareId);
      toast.success('Share link deleted');
      fetchSharedLinks();
    } catch (error) {
      console.error('Error deleting share link:', error);
      toast.error('Failed to delete share link');
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Generate quick share text
  const generateQuickShareText = () => {
    if (!shareableStats) return '';
    
    const { stats, topHabits } = shareableStats;
    const topHabit = topHabits[0];
    
    return `🎯 My Habit Progress Update!\n\n` +
           `📊 ${stats.totalHabits} active habits\n` +
           `✅ ${stats.totalCompletions} total completions\n` +
           `🔥 ${stats.longestStreak} day longest streak\n` +
           `📈 ${stats.averageStreak} day average streak\n\n` +
           (topHabit ? `🏆 Top habit: ${topHabit.emoji} ${topHabit.name} (${topHabit.current_streak} day streak)\n\n` : '') +
           `Track your habits too! 💪`;
  };

  useEffect(() => {
    if (user) {
      fetchShareableStats();
      fetchSharedLinks();
    }
  }, [user, fetchShareableStats, fetchSharedLinks]);

  if (loading && !shareableStats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Share Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your habit progress with others
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
          Share Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share your habit progress with others
        </p>
      </div>

      {/* Quick Share Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Share
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => copyToClipboard(generateQuickShareText())}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl mb-2 block">📱</span>
              <p className="font-medium text-gray-900 dark:text-white">Copy Text Summary</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share as text message</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl mb-2 block">🔗</span>
              <p className="font-medium text-gray-900 dark:text-white">Create Share Link</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate shareable URL</p>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Preview */}
      {shareableStats && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Progress Summary
          </h3>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {shareableStats.stats.totalHabits}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Habits</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {shareableStats.stats.totalCompletions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Completions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {shareableStats.stats.longestStreak}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {shareableStats.stats.averageStreak}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Streak</p>
            </div>
          </div>

          {/* Top Habits */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Top Habits</h4>
            <div className="space-y-2">
              {shareableStats.topHabits.slice(0, 3).map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{habit.emoji}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {habit.current_streak} days
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Best: {habit.longest_streak}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Share Form */}
      {showCreateForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Share Link
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={createShareableLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={shareForm.title}
                onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                placeholder="My Habit Progress"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={shareForm.description}
                onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })}
                placeholder="Share your progress and inspire others!"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={shareForm.includeStats}
                  onChange={(e) => setShareForm({ ...shareForm, includeStats: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include statistics</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={shareForm.includeHabits}
                  onChange={(e) => setShareForm({ ...shareForm, includeHabits: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include top habits</span>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {loading ? 'Creating...' : 'Create & Copy Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shared Links */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Shared Links
        </h3>
        
        {sharedLinks.length > 0 ? (
          <div className="space-y-3">
            {sharedLinks.map((link) => (
              <div key={link.share_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {link.title || 'Untitled Share'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created {new Date(link.created_at).toLocaleDateString()}
                  </p>
                  {link.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(link.shareUrl)}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => deleteSharedLink(link.share_id)}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No shared links yet
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Create Your First Share Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Share;
