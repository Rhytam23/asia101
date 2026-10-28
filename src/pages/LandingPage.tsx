import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Users, TrendingUp, Shield, Globe, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Full class names so Tailwind can detect them at build time
const PERSONA_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const primaryCta = isAuthenticated ? '/mission-control' : '/signup';

  const stats = [
    { value: "28,670", label: "ha Monitored", unit: "Mekong Delta" },
    { value: "94.2%", label: "Avg AI Accuracy", unit: "2025 validation" },
    { value: "4.1", label: "t/ha Yield Lift", unit: "across pilot farms" },
    { value: "39%", label: "Water Savings", unit: "projected 2026" },
  ];

  const features = [
    { icon: Satellite, title: "Multi-Satellite Fusion", desc: "Sentinel-1/2, MODIS, CHIRPS, MONRE ground truth fused in real time." },
    { icon: Zap, title: "Explainable AI", desc: "Every recommendation includes confidence, reasoning and supporting datasets." },
    { icon: Users, title: "Role-Specific Dashboards", desc: "Tailored for farmers, cooperatives, government agencies and researchers." },
    { icon: TrendingUp, title: "Economic Impact Engine", desc: "Yield, income, water savings and cost-benefit analysis in every decision." },
    { icon: Shield, title: "Salinity & Climate Resilience", desc: "Historical replay of 2016 & 2020 crises with predictive modeling." },
    { icon: Globe, title: "Production-Ready", desc: "Designed for Ministry of Agriculture deployment at scale." },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Site header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tighter">MS</span>
            </div>
            <span className="font-semibold tracking-tight">Mekong Smart Land</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#pipeline" className="hover:text-slate-900 transition-colors">Pipeline</a>
            <a href="#roles" className="hover:text-slate-900 transition-colors">Roles</a>
          </nav>
          <Link
            to={primaryCta}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {isAuthenticated ? 'Open Platform' : 'Sign in'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#14532D_0.5px,transparent_1px)] bg-[length:5px_5px] opacity-[0.035]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2 animate-pulse"></div>
              2026 INTERNATIONAL HACKATHON • VIETNAM
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[1.02] mb-6">
              MEKONG<br />SMART LAND
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 tracking-tight mb-2">Satellite-powered Climate Decision Intelligence</p>
            <p className="text-lg sm:text-xl text-slate-500 max-w-md">For Vietnamese agriculture. Built for resilience. Designed for the Ministry.</p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link 
                to={primaryCta}
                className="inline-flex items-center gap-3 px-7 h-14 bg-primary hover:bg-emerald-900 active:bg-emerald-950 transition-all text-white font-semibold rounded-2xl text-base sm:text-lg shadow-sm hover:shadow-md"
              >
                Open Intelligence Platform <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/gis-map"
                className="inline-flex items-center gap-3 px-7 h-14 border border-slate-300 hover:bg-slate-50 font-medium rounded-2xl text-base sm:text-lg transition-colors"
              >
                Explore Live GIS Map
              </Link>
            </div>

            <div className="mt-8 text-sm text-slate-500 flex items-center gap-x-5">
              <div>Trusted by 12 provincial offices</div>
              <div>•</div>
              <div>Validated with 2020 event data</div>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="border-t bg-white">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-baseline gap-x-3">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tighter text-primary tabular-nums">{stat.value}</div>
                <div>
                  <div className="font-medium text-slate-700">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="capabilities" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-16">
        <div className="flex items-center gap-4 mb-9">
          <div className="uppercase tracking-[2px] text-xs font-semibold text-primary">Core Capabilities</div>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group p-7 border border-slate-200 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 bg-white rounded-3xl transition-all">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-2xl mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-xl mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-[15px]">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Overview */}
      <div id="pipeline" className="bg-white border-y scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8">
            <div>
              <div className="text-xs tracking-[1px] font-semibold text-emerald-700">END-TO-END PIPELINE</div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight mt-1">From Orbit to Farmer SMS</div>
            </div>
            <Link to="/mission-control" className="text-sm font-medium flex items-center gap-1 text-primary hover:underline">
              View Full Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
            {[
              'Satellite Data', 'Validation', 'ML Prediction', 
              'Decision Intelligence', 'SMS Alerts'
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl flex-1 text-center">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-700 text-sm flex items-center justify-center font-bold">{idx + 1}</div>
                  <div className="font-semibold text-sm leading-tight">{step}</div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* User Personas */}
      <div id="roles" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-16">
        <div className="mb-9">
          <div className="uppercase tracking-wider text-xs text-slate-500 mb-1">BUILT FOR EVERY STAKEHOLDER</div>
          <div className="text-3xl sm:text-4xl font-semibold tracking-tighter">Dedicated workflows for 4 user roles</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { role: 'Farmer', title: 'Nguyen Van Minh', subtitle: 'Chau Doc, An Giang', link: '/dashboards/farmer', color: 'emerald' },
            { role: 'Cooperative', title: 'Kien Giang Rice Coop', subtitle: '167k ha under management', link: '/dashboards/cooperative', color: 'blue' },
            { role: 'Government', title: 'MARD — Ministry', subtitle: 'Policy & Provincial Coordination', link: '/dashboards/government', color: 'violet' },
            { role: 'Researcher', title: 'Can Tho University', subtitle: 'Climate & Agronomy Research', link: '/dashboards/researcher', color: 'amber' },
          ].map((persona, i) => (
            <Link 
              to={persona.link} 
              key={i} 
              className="group border border-slate-200 bg-white hover:border-emerald-300 hover:-translate-y-0.5 hover:shadow-md px-6 py-7 rounded-3xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className={`inline-block text-xs font-semibold tracking-[1px] rounded-full px-3 py-1 mb-5 ${PERSONA_STYLES[persona.color]}`}>
                  {persona.role.toUpperCase()}
                </div>
                <div className="font-semibold tracking-tight text-xl group-hover:text-emerald-700 transition-colors">{persona.title}</div>
                <div className="text-sm text-slate-500 mt-0.5">{persona.subtitle}</div>
              </div>
              <div className="mt-auto pt-6 text-xs flex items-center gap-2 text-emerald-700 font-medium">
                OPEN DASHBOARD <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-primary text-white rounded-3xl px-6 sm:px-9 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-white/70 text-sm font-medium">READY FOR PRODUCTION</div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter mt-1">Enterprise-grade. Deployable today.</div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to={primaryCta} className="bg-white hover:bg-slate-100 active:bg-white px-7 py-3 text-primary font-semibold rounded-3xl">Open Intelligence Platform</Link>
            <Link to="/gis-map" className="bg-white/10 hover:bg-white/20 border border-white/30 px-7 py-3 text-white font-medium rounded-3xl">Open Interactive Map</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>© 2026 Mekong Smart Land System</div>
          <div>Satellite-powered climate decision intelligence for the Mekong Delta</div>
        </div>
      </footer>
    </div>
  );
}
