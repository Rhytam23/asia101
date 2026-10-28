import { useState } from 'react';
import FarmerDashboard from '../components/dashboards/FarmerDashboard';
import CooperativeDashboard from '../components/dashboards/CooperativeDashboard';
import GovernmentDashboard from '../components/dashboards/GovernmentDashboard';
import ResearchDashboard from '../components/dashboards/ResearchDashboard';

const ROLES = [
  { id: 'farmer', label: 'Farmer' },
  { id: 'cooperative', label: 'Cooperative' },
  { id: 'government', label: 'Government' },
  { id: 'researcher', label: 'Research' },
] as const;

type Role = typeof ROLES[number]['id'];

export default function RoleDashboards() {
  const [activeRole, setActiveRole] = useState<Role>('farmer');

  const CurrentComponent = 
    activeRole === 'farmer' ? FarmerDashboard :
    activeRole === 'cooperative' ? CooperativeDashboard :
    activeRole === 'government' ? GovernmentDashboard :
    ResearchDashboard;

  return (
    <div className="bg-slate-50 -mx-4 sm:-mx-6 -my-6 sm:-my-8 min-h-[calc(100vh-4rem)]">
      {/* Persistent Role Switcher — instant client-side, no reload */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="font-semibold text-lg tracking-tight">Role Dashboards</h1>
          
          <div role="tablist" aria-label="Dashboard role" className="flex bg-slate-100 rounded-2xl p-1 text-sm max-w-full overflow-x-auto">
            {ROLES.map((role) => (
              <button
                key={role.id}
                role="tab"
                aria-selected={activeRole === role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-4 sm:px-6 py-1.5 rounded-[14px] font-medium transition-all whitespace-nowrap ${
                  activeRole === role.id 
                    ? 'bg-white shadow-sm text-emerald-800' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
          
          <div className="ml-auto text-xs text-slate-500 hidden md:block">
            All dashboards reuse shared components + live data services
          </div>
        </div>
      </div>

      {/* Selected role renders here — zero page reload */}
      <div role="tabpanel">
        <CurrentComponent />
      </div>
    </div>
  );
}

