import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HabitContext = createContext({});

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

const initialState = {
  habits: [],
  todayProgress: [],
  loading: false,
  error: null
};

const habitReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_HABITS':
      return { ...state, habits: action.payload, loading: false };
    case 'SET_TODAY_PROGRESS':
      return { ...state, todayProgress: action.payload, loading: false };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        )
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
      };
    case 'TOGGLE_PROGRESS':
      return {
        ...state,
        todayProgress: state.todayProgress.map(item =>
          item.habit.id === action.payload.habitId
            ? { ...item, completed: action.payload.completed }
            : item
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const { user } = useAuth();

  // Fetch habits
  const fetchHabits = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const data = await apiCall('/api/habits?active=true');

      dispatch({ type: 'SET_HABITS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching habits:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load habits');
    }
  }, [user]);

  // Fetch today's progress
  const fetchTodayProgress = useCallback(async () => {
    if (!user) return;

    try {
      const data = await apiCall('/api/progress/today');
      dispatch({ type: 'SET_TODAY_PROGRESS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching today progress:', error);
      toast.error('Failed to load today\'s progress');
    }
  }, [user]);

  // Create habit
  const createHabit = async (habitData) => {
    if (!user) return;

    try {
      const data = await apiCall('/api/habits', {
        method: 'POST',
        body: JSON.stringify(habitData)
      });

      dispatch({ type: 'ADD_HABIT', payload: data });
      toast.success('Habit created successfully!');

      // Refresh today's progress
      fetchTodayProgress();

      return { data, error: null };
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
      return { data: null, error };
    }
  };

  // Update habit
  const updateHabit = async (habitId, updates) => {
    try {
      const data = await apiCall(`/api/habits/${habitId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      dispatch({ type: 'UPDATE_HABIT', payload: data });
      toast.success('Habit updated successfully!');

      return { data, error: null };
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
      return { data: null, error };
    }
  };

  // Delete habit
  const deleteHabit = async (habitId) => {
    try {
      await apiCall(`/api/habits/${habitId}`, {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_HABIT', payload: habitId });
      toast.success('Habit deleted successfully!');

      // Refresh today's progress
      fetchTodayProgress();

      return { error: null };
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
      return { error };
    }
  };

  // Toggle habit completion
  const toggleHabitCompletion = async (habitId, date = null) => {
    if (!user) return;

    try {
      const targetDate = date || new Date().toISOString().split('T')[0];

      const data = await apiCall('/api/progress/toggle', {
        method: 'POST',
        body: JSON.stringify({
          habitId,
          date: targetDate
        })
      });

      // Update local state for today's progress
      if (targetDate === new Date().toISOString().split('T')[0]) {
        dispatch({
          type: 'TOGGLE_PROGRESS',
          payload: {
            habitId,
            completed: data.completed
          }
        });
      }

      // Refresh habits to update streaks
      fetchHabits();

      return { data, error: null };
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast.error('Failed to update progress');
      return { data: null, error };
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchTodayProgress();
    } else {
      dispatch({ type: 'SET_HABITS', payload: [] });
      dispatch({ type: 'SET_TODAY_PROGRESS', payload: [] });
    }
  }, [user, fetchHabits, fetchTodayProgress]);

  const value = {
    ...state,
    fetchHabits,
    fetchTodayProgress,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};