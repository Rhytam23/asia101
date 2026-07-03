import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Shield, Home } from 'lucide-react';

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: 'Farmer' as UserRole,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    login({
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      role: formData.role,
    });
    navigate('/mission-control');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join the Mekong Smart Land Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1">
                <input
                  required
                  type="text"
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  required
                  type="email"
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Organization / Farm Name</label>
              <div className="mt-1">
                <input
                  required
                  type="text"
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <div className="mt-1">
                <select
                  className="block w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Government">Government Agency</option>
                  <option value="Research">Research Institution</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1">
                  <input
                    required
                    type="password"
                    className="block w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm</label>
                <div className="mt-1">
                  <input
                    required
                    type="password"
                    className="block w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex justify-center">
            <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <Home className="w-4 h-4" /> Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
