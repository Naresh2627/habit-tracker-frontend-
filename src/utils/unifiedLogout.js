// Unified logout solution for Better Auth

let isLoggingOut = false;

export const unifiedLogout = async () => {
  // Prevent multiple simultaneous logout attempts
  if (isLoggingOut) {
    console.log('🔄 Logout already in progress, ignoring...');
    return;
  }

  isLoggingOut = true;
  console.log('🚪 UNIFIED LOGOUT - Starting...');

  try {
    // Clear all storage immediately
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('✅ Storage and cookies cleared');

    // Force redirect immediately
    window.location.replace('/login');

    // Reset flag after redirect
    setTimeout(() => {
      isLoggingOut = false;
    }, 2000);

  } catch (error) {
    console.error('Logout error:', error);
    // Emergency fallback
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
    isLoggingOut = false;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.unifiedLogout = unifiedLogout;
}