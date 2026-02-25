import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession, signIn as betterAuthSignIn, signUp as betterAuthSignUp, signOut as betterAuthSignOut } from '../config/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [session, isPending]);

  const signUp = useCallback(async (email, password, name) => {
    try {
      const result = await betterAuthSignUp.email({
        email,
        password,
        name,
        callbackURL: window.location.origin
      });

      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      toast.success('Account created successfully!');
      return { data: result, error: null };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { data: null, error };
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const result = await betterAuthSignIn.email({
        email,
        password,
        callbackURL: window.location.origin
      });

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      toast.success('Welcome back!');
      return { data: result, error: null };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await betterAuthSignOut();

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setUser(null);
      toast.success('Logged out successfully');

      // Redirect to login
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even on error
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      window.location.replace('/login');
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await betterAuthSignIn.social({
        provider: 'google',
        callbackURL: window.location.origin
      });

      if (result.error) {
        throw new Error(result.error.message || 'Google login failed');
      }

      return { data: result, error: null };
    } catch (error) {
      toast.error(error.message || 'Google login failed');
      return { data: null, error };
    }
  }, []);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
