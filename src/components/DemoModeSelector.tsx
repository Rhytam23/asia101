import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDemoMode, DemoScenario } from '../context/DemoModeContext';
import { Play, X } from 'lucide-react';

const SCENARIOS: { id: DemoScenario; label: string; location: string }[] = [
  { id: 'normal', label: 'Normal Season', location: 'Can Tho' },
  { id: 'flood', label: 'Flood Warning', location: 'Kien Giang' },
  { id: 'drought', label: 'Drought', location: 'An Giang' },
  { id: 'high-salinity', label: 'High Salinity', location: 'Soc Trang' },
  { id: 'gov-response', label: 'Government Response', location: 'Tra Vinh' },
];

// Public pages have no app data to switch, so the demo control would only be noise there
const HIDDEN_ON = ['/', '/signup'];

export default function DemoModeSelector() {
  const { isDemoMode, currentScenario, setScenario, exitDemoMode, toggleDemoMode } = useDemoMode();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isDemoMode) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && exitDemoMode();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDemoMode, exitDemoMode]);

  if (HIDDEN_ON.includes(pathname)) return null;

  const current = SCENARIOS.find(s => s.id === currentScenario);

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] font-sans flex justify-end pointer-events-none">
      {!isDemoMode ? (
        <button
          onClick={toggleDemoMode}
          className="pointer-events-auto flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white pl-3.5 pr-4 h-11 rounded-full shadow-lg text-sm font-semibold transition-all active:scale-[0.97]"
        >
          <Play className="w-4 h-4" aria-hidden />
          Demo mode
        </button>
      ) : (
        <section
          aria-label="Demo mode"
          className="pointer-events-auto bg-white border border-emerald-200 shadow-2xl rounded-3xl overflow-hidden w-full sm:w-72 animate-scale-in origin-bottom-right"
        >
          <div className="bg-emerald-700 text-white px-4 py-2.5 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden />
              Demo mode active
            </div>
            <button
              onClick={exitDemoMode}
              aria-label="Exit demo mode"
              className="p-1 -mr-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-0.5">Current scenario</div>
            <div className="font-semibold text-emerald-900">{current?.label ?? 'Custom'}</div>
            {current && <div className="text-xs text-emerald-600 mt-0.5">{current.location}</div>}
          </div>

          <div className="p-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 px-2 mb-1.5 font-medium">Switch scenario</div>
            <ul className="grid grid-cols-1 gap-1">
              {SCENARIOS.map(s => {
                const active = currentScenario === s.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setScenario(s.id)}
                      aria-pressed={active}
                      className={`w-full text-left px-3 py-2 rounded-2xl text-sm flex items-center justify-between transition ${
                        active ? 'bg-emerald-100 text-emerald-900 font-medium' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{s.label}</span>
                      {active && <span className="text-[10px] font-semibold text-emerald-700">ACTIVE</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="px-3 pb-3 pt-2 text-[10px] text-center text-slate-500 border-t border-slate-100">
            All panels update instantly • Press Esc to exit
          </p>
        </section>
      )}
    </div>
  );
}
