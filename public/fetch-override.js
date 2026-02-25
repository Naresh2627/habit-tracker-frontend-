// Global fetch override that loads before any other scripts
// This prevents Supabase from making logout requests

(function() {
  console.log('🔧 Installing aggressive fetch override...');
  
  // Store the original fetch
  const originalFetch = window.fetch;
  
  // Override fetch globally - block ALL logout requests by default
  window.fetch = function(url, options = {}) {
    // Always block Supabase logout requests
    if (typeof url === 'string' && (
        url.includes('supabase.co/auth/v1/logout') ||
        url.includes('/auth/v1/logout') ||
        (url.includes('logout') && url.includes('supabase'))
    )) {
      console.log('🚫 BLOCKED Supabase logout request:', url);
      return Promise.resolve(new Response('{"message":"logout blocked"}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Otherwise, use original fetch
    return originalFetch.apply(this, arguments);
  };
  
  // Emergency signout function available immediately
  window.emergencyLogout = function() {
    console.log('🚨 EMERGENCY LOGOUT');
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    window.location.href = '/login';
  };
  
  console.log('✅ Aggressive fetch override installed - all logout requests will be blocked');
})();