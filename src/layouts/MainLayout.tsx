import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Map, Activity, Brain, Clock, BarChart3, Layers, 
  BookOpen, Users, Menu, X 
} from 'lucide-react';

const navItems = [
  { href: '/mission-control', label: 'Mission Control', icon: Home },
  { href: '/live-ops', label: 'Live Operations', icon: Activity },
  { href: '/gis-map', label: 'GIS Map', icon: Map },
  { href: '/ai-engine', label: 'AI Decision Engine', icon: Brain },
  { href: '/historical', label: 'Historical Replay', icon: Clock },
  { href: '/analytics', label: 'Impact Analytics', icon: BarChart3 },
  { href: '/architecture', label: 'Architecture', icon: Layers },
  { href: '/docs', label: 'Documentation', icon: BookOpen },
];

const dashboardLinks = [
  { href: '/dashboards', label: 'All Dashboards', icon: Users },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-tighter">MS</span>
              </div>
              <div>
                <div className="font-semibold text-lg tracking-tight text-slate-900">MEKONG SMART LAND</div>
                <div className="text-[10px] text-slate-500 -mt-1">Climate Decision Intelligence</div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`nav-link flex items-center gap-1.5 ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Unified Role Dashboards */}
            <Link 
              to="/dashboards" 
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 hover:bg-slate-50 rounded-2xl"
            >
              <Users className="w-4 h-4" /> Dashboards
            </Link>

            <Link 
              to="/mission-control" 
              className="hidden md:flex px-5 py-2 rounded-2xl bg-primary hover:bg-emerald-900 transition text-white text-sm font-semibold items-center gap-2"
            >
              <Activity className="w-4 h-4" /> Open Platform
            </Link>

            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="md:hidden p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-5 py-4">
            <div className="flex flex-col gap-1 text-sm">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${isActive(item.href) ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </Link>
                );
              })}
              <div className="h-px bg-slate-200 my-1"></div>
              {dashboardLinks.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-100"
                  >
                    <Icon className="w-4 h-4" /> {item.label} Dashboard
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-y-2">
          <div>© 2026 MEKONG SMART LAND • Satellite Climate Decision Intelligence • Vietnam</div>
          <div className="flex items-center gap-x-6 text-xs">
            <span>Powered by Sentinel • MODIS • CHIRPS • MONRE</span>
            <Link to="/docs" className="hover:text-slate-700">Scientific Sources</Link>
            <Link to="/architecture" className="hover:text-slate-700">System Architecture</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
