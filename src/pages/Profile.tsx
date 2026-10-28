import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Shield, Bell, Globe, Moon } from 'lucide-react';

export default function Profile() {
  const { user, updatePreferences, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information and preferences.</p>
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Personal Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</div>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <User className="w-4 h-4 text-slate-400" /> {user.name}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</div>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Organization</div>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <Building className="w-4 h-4 text-slate-400" /> {user.organization}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <Shield className="w-4 h-4 text-emerald-500" /> {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Application Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Email Notifications</div>
                    <div className="text-sm text-slate-500">Receive alerts and weekly reports</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    aria-label="Email notifications"
                    checked={user.preferences.notifications}
                    onChange={(e) => updatePreferences({ notifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/40 peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                    <Moon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Interface Theme</div>
                    <div className="text-sm text-slate-500">Select your visual preference</div>
                  </div>
                </div>
                <select
                  aria-label="Interface theme"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/30 focus:border-primary block p-2.5"
                  value={user.preferences.theme}
                  onChange={(e) => updatePreferences({ theme: e.target.value as any })}
                >
                  <option value="light">Light</option>
                  <option value="dark" disabled>Dark (coming soon)</option>
                  <option value="system" disabled>System (coming soon)</option>
                </select>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Language</div>
                    <div className="text-sm text-slate-500">Regional localization</div>
                  </div>
                </div>
                <select
                  aria-label="Language"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/30 focus:border-primary block p-2.5"
                  value={user.preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value as any })}
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="text-sm text-slate-500 italic">No recent activity to display.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
