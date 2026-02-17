// Base API URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Generic API call function - now uses cookies for session (Better Auth)
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}/api${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include' // Include cookies for Better Auth session
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// API methods
export const api = {
  // Auth endpoints
  auth: {
    register: (data) => apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    login: (data) => apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    logout: () => apiCall('/auth/logout', {
      method: 'POST'
    }),
    me: () => apiCall('/auth/me')
  },

  // Protected endpoints
  habits: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiCall(`/habits${queryString ? `?${queryString}` : ''}`);
    },
    create: (data) => apiCall('/habits', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/habits/${id}`, {
      method: 'DELETE'
    }),
    getCategories: () => apiCall('/habits/categories')
  },

  progress: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiCall(`/progress${queryString ? `?${queryString}` : ''}`);
    },
    toggle: (data) => apiCall('/progress/toggle', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getToday: () => apiCall('/progress/today'),
    getStats: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiCall(`/progress/stats${queryString ? `?${queryString}` : ''}`);
    },
    getCalendar: (year, month, habitId = null) => {
      const params = habitId ? `?habitId=${habitId}` : '';
      return apiCall(`/progress/calendar/${year}/${month}${params}`);
    },
    delete: (id) => apiCall(`/progress/${id}`, {
      method: 'DELETE'
    })
  },

  users: {
    getProfile: () => apiCall('/users/profile'),
    updateProfile: (data) => apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getDashboard: () => apiCall('/users/dashboard'),
    deleteAccount: () => apiCall('/users/account', {
      method: 'DELETE'
    })
  },

  share: {
    getStats: () => apiCall('/share/stats'),
    getUserLinks: () => apiCall('/share/user/links'),
    createLink: (data) => apiCall('/share/create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getShared: (shareId) => apiCall(`/share/${shareId}`),
    deleteLink: (shareId) => apiCall(`/share/${shareId}`, {
      method: 'DELETE'
    })
  }
};

export default api;