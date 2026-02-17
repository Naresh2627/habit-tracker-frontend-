import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HabitProvider } from './contexts/HabitContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Today from './pages/Today';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Share from './pages/Share';
import Profile from './pages/Profile';
import SharedProgress from './pages/SharedProgress';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'dark:bg-gray-800 dark:text-white',
                }}
              />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/share/:shareId" element={<SharedProgress />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Today />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/habits" element={
                  <ProtectedRoute>
                    <Layout>
                      <Habits />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Layout>
                      <Calendar />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Layout>
                      <Progress />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/share" element={
                  <ProtectedRoute>
                    <Layout>
                      <Share />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;