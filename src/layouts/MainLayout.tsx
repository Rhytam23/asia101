import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Map, Activity, Brain, Clock, BarChart3, 
  Menu, X, LogOut, Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Base items for all users
  const navItems = [
    { href: '/mission-control', label: 'Mission Control', icon: Home },
    { href: '/live-ops', label: 'Live Operations', icon: Activity },
    { href: '/ai-engine', label: 'AI Engine', icon: Brain },
  ];

  // Additional items for non-Farmers
  if (hasRole(['Cooperative', 'Government', 'Research'])) {
    navItems.push(
      { href: '/gis-map', label: 'GIS Map', icon: Map },
      { href: '/historical', label: 'Historical Replay', icon: Clock },
      { href: '/analytics', label: 'Impact Analytics', icon: BarChart3 }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/mission-control" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-tighter">MS</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-sm tracking-tight text-slate-900 leading-none">Mekong Smart Land</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{user?.organization || 'Platform'}</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href) 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-700 leading-none">{user.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{user.role}</div>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden py-1">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm text-slate-900 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/signup" 
                className="hidden md:flex px-4 py-2 rounded-lg bg-primary hover:bg-emerald-800 transition text-white text-sm font-semibold"
              >
                Sign In
              </Link>
            )}

            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 absolute w-full shadow-lg z-50">
            <div className="flex flex-col gap-1 text-sm font-medium">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive(item.href) 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
