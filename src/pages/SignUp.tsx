import { useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, Satellite, Sprout, Building2, Landmark, FlaskConical } from 'lucide-react';

const DEMO_PERSONAS: {
  role: UserRole;
  name: string;
  organization: string;
  email: string;
  icon: typeof Sprout;
  tint: string;
}[] = [
  { role: 'Farmer', name: 'Nguyen Van Minh', organization: 'Chau Doc, An Giang', email: 'minh@demo.mekong.vn', icon: Sprout, tint: 'bg-emerald-100 text-emerald-700' },
  { role: 'Cooperative', name: 'Tran Thi Lan', organization: 'Kien Giang Rice Coop', email: 'lan@demo.mekong.vn', icon: Building2, tint: 'bg-blue-100 text-blue-700' },
  { role: 'Government', name: 'Le Quang Huy', organization: 'MARD — Ministry', email: 'huy@demo.mekong.vn', icon: Landmark, tint: 'bg-violet-100 text-violet-700' },
  { role: 'Research', name: 'Pham Thu Ha', organization: 'Can Tho University', email: 'ha@demo.mekong.vn', icon: FlaskConical, tint: 'bg-amber-100 text-amber-700' },
];

const inputClass =
  'block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children(id)}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo: string = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/mission-control';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: 'Farmer' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const finish = (user: { name: string; email: string; organization: string; role: UserRole }) => {
    login(user);
    // Landing on a page the role can't see would just bounce back, so fall back to Mission Control
    const restricted = ['/gis-map', '/historical', '/analytics'];
    navigate(user.role === 'Farmer' && restricted.includes(redirectTo) ? '/mission-control' : redirectTo, { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    finish({
      name: formData.name.trim(),
      email: formData.email.trim(),
      organization: formData.organization.trim(),
      role: formData.role,
    });
  };

  const update = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    setFormData({ ...formData, [key]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary text-white p-12">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.6px,transparent_1px)] bg-[length:6px_6px] opacity-[0.07]" aria-hidden />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-emerald-400/20 blur-3xl" aria-hidden />

        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
            <Satellite className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight">Mekong Smart Land</span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            Climate decisions, grounded in satellite data.
          </h1>
          <p className="mt-4 text-emerald-100/90 leading-relaxed">
            Salinity, water and market signals fused into clear, explainable recommendations for every role in the Mekong Delta.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6">
            {[
              ['28,670', 'ha monitored'],
              ['94.2%', 'AI accuracy'],
              ['39%', 'water savings'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-2xl font-semibold tracking-tight tabular-nums">{v}</dt>
                <dd className="text-xs text-emerald-100/80 mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative text-xs text-emerald-100/70">2026 International Hackathon • Vietnam</p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Get started</h2>
          <p className="mt-2 text-sm text-slate-600">Try the platform instantly as a sample user, or create your own account.</p>

          {/* Quick demo access */}
          <section aria-labelledby="demo-access" className="mt-8">
            <h3 id="demo-access" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Continue as a demo user
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_PERSONAS.map(({ icon: Icon, tint, ...persona }) => (
                <button
                  key={persona.role}
                  type="button"
                  onClick={() => finish(persona)}
                  className="group flex items-center gap-3 text-left bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md rounded-2xl p-3.5 transition-all"
                >
                  <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${tint}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{persona.role}</span>
                    <span className="block text-xs text-slate-500 truncate">{persona.organization}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 my-8" role="separator" aria-label="or">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">or create an account</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div role="alert" className="p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full name">
                {(id) => (
                  <input id={id} required autoComplete="name" type="text" className={inputClass} value={formData.name} onChange={update('name')} />
                )}
              </Field>
              <Field label="Email address">
                {(id) => (
                  <input id={id} required autoComplete="email" type="email" className={inputClass} value={formData.email} onChange={update('email')} />
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Organization / farm">
                {(id) => (
                  <input id={id} required autoComplete="organization" type="text" className={inputClass} value={formData.organization} onChange={update('organization')} />
                )}
              </Field>
              <Field label="Role">
                {(id) => (
                  <select id={id} className={inputClass} value={formData.role} onChange={update('role')}>
                    <option value="Farmer">Farmer</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Government">Government agency</option>
                    <option value="Research">Research institution</option>
                  </select>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Password" hint="At least 8 characters.">
                {(id) => (
                  <div className="relative">
                    <input
                      id={id}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass} pr-11`}
                      value={formData.password}
                      onChange={update('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </Field>
              <Field label="Confirm password">
                {(id) => (
                  <input
                    id={id}
                    required
                    autoComplete="new-password"
                    type={showPassword ? 'text' : 'password'}
                    className={inputClass}
                    value={formData.confirmPassword}
                    onChange={update('confirmPassword')}
                  />
                )}
              </Field>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 active:bg-emerald-950 transition-colors"
            >
              Create account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
