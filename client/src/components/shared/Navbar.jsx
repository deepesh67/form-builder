import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, UserPlus, LayoutDashboard, Database, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Database className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">FormFlow</span>
          </Link>

          {/* Main Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  isActive('/dashboard') ? 'bg-brand-500/10 text-brand-500' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              {/* Removed redundant "Create New" as it's on Dashboard */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-sm font-bold text-white">{user.name}</span>
                  <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white px-4">Login</Link>
              <Link to="/register" className="btn-premium btn-premium-primary h-11 px-6 text-sm">
                <UserPlus size={18} className="mr-1" /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
