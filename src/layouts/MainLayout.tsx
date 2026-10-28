import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Map, Activity, Brain, Clock, BarChart3, 
  Menu, X, LogOut, Settings, TrendingUp, Users, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole, switchRole } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Close any open menu when the route changes or Escape is pressed
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Base items for all users
  const navItems = [
    { href: '/mission-control', label: 'Mission Control', icon: Home },
    { href: '/live-ops', label: 'Live Operations', icon: Activity },
    { href: '/market-intelligence', label: 'Market Intelligence', icon: TrendingUp },
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-primary focus:font-semibold focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
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
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
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
                  aria-haspopup="menu"
                  aria-expanded={profileDropdownOpen}
                  aria-label="Account menu"
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
                    <div role="menu" className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>

                      <div className="h-px bg-slate-100 my-1" />
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role</div>
                      {(['Farmer', 'Cooperative', 'Government', 'Research'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            switchRole(role);
                            setProfileDropdownOpen(false);
                            navigate('/mission-control');
                          }}
                          role="menuitemradio"
                          aria-checked={user.role === role}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${user.role === role ? 'text-emerald-700 bg-emerald-50 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Users className="w-4 h-4" /> {role}
                          {user.role === role && <Check className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}

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
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 absolute w-full shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-fade-in">
            <div className="flex flex-col gap-1 text-sm font-medium">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
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

      <main id="main" tabIndex={-1} className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 focus:outline-none">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-slate-500">
          <span>© 2026 Mekong Smart Land System</span>
          <span>Demonstration data is labeled where live APIs are unavailable</span>
        </div>
      </footer>
    </div>
  );
}
