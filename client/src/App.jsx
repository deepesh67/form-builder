import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/shared/Navbar';
import Dashboard from './pages/admin/Dashboard';
import Builder from './pages/admin/Builder';
import Responses from './pages/admin/Responses';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './pages/public/LandingPage';
import PublicForm from './pages/public/PublicForm';
import Success from './pages/public/Success';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const { token } = useAuth();

  // Force Dark Theme Only
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#020617';
  }, []);

  // Hide Navbar on Builder and Public Forms
  const hideNavbar = location.pathname.includes('/forms/new') || 
                     location.pathname.includes('/forms/edit') || 
                     location.pathname.includes('/forms/preview') ||
                     location.pathname.includes('/forms/'); // Includes public submission

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 no-scrollbar selection:bg-brand-500/30">
      {!hideNavbar && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/forms/:id" element={<PublicForm />} />
          <Route path="/forms/preview/:id" element={<PublicForm />} />
          <Route path="/success" element={<Success />} />

          {/* Protected Area */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/forms/new" element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          } />
          <Route path="/forms/edit/:id" element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          } />
          <Route path="/responses/:id" element={
            <ProtectedRoute>
              <Responses />
            </ProtectedRoute>
          } />
          <Route path="/responses" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
