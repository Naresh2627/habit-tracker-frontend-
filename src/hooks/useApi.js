import { useState } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiFunction, options = {}) => {
    const { 
      showLoading = true, 
      showSuccess = false, 
      successMessage = 'Success!',
      showError = true 
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const result = await apiFunction();
      
      if (showSuccess) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      if (showError) {
        toast.error(err.message || 'Something went wrong');
      }
      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  return { callApi, loading, error };
};

// Specific hooks for different API sections
export const useHabitsApi = () => {
  const { callApi, loading, error } = useApi();

  const getHabits = () => callApi(() => api.habits.getAll());
  const createHabit = (data) => callApi(() => api.habits.create(data), { 
    showSuccess: true, 
    successMessage: 'Habit created!' 
  });
  const updateHabit = (id, data) => callApi(() => api.habits.update(id, data), { 
    showSuccess: true, 
    successMessage: 'Habit updated!' 
  });
  const deleteHabit = (id) => callApi(() => api.habits.delete(id), { 
    showSuccess: true, 
    successMessage: 'Habit deleted!' 
  });

  return { getHabits, createHabit, updateHabit, deleteHabit, loading, error };
};

export const useProgressApi = () => {
  const { callApi, loading, error } = useApi();

  const getProgress = () => callApi(() => api.progress.getAll());
  const createProgress = (data) => callApi(() => api.progress.create(data));
  const updateProgress = (id, data) => callApi(() => api.progress.update(id, data));

  return { getProgress, createProgress, updateProgress, loading, error };
};

export const useUsersApi = () => {
  const { callApi, loading, error } = useApi();

  const getProfile = () => callApi(() => api.users.getProfile());
  const updateProfile = (data) => callApi(() => api.users.updateProfile(data), { 
    showSuccess: true, 
    successMessage: 'Profile updated!' 
  });

  return { getProfile, updateProfile, loading, error };
};

export default useApi;