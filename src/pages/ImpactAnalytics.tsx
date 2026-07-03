import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { provinces } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';

const yieldData = provinces.map(p => ({
  name: p.name.split(' ')[0],
  yield: parseFloat((4.6 + (p.ndviAvg - 0.5) * 4.4).toFixed(1)),
  risk: p.salinityRisk,
}));

const economicImpact = [
  { month: 'Mar', value: 142 }, { month: 'Apr', value: 187 }, { month: 'May', value: 201 },
  { month: 'Jun', value: 269 }, { month: 'Jul', value: 311 },
];

const adoption = [
  { name: 'AWD', value: 44 }, { name: 'Saline Varieties', value: 31 }, 
  { name: 'Early Harvest', value: 18 }, { name: 'Barriers', value: 7 },
];

const COLORS = ['#14532D', '#22C55E', '#3B82F6', '#F59E0B'];

export default function ImpactAnalytics() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight text-slate-900 mb-2">Impact Analytics</h1>
          <p className="text-slate-500">2026 Season-to-date: Economic and climate outcomes</p>
        </div>
        <Badge variant="slate" className="py-1.5 px-3 uppercase tracking-wider">
          Updated 4 minutes ago
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        {[
          { label: "Projected Economic Impact", value: "₫243.4M", sub: "+31% vs last season" },
          { label: "Water Saved", value: "38.2M m³", sub: "Across 19,600 ha" },
          { label: "Yield Improvement", value: "+1.1 t/ha", sub: "Average across pilot" },
        ].map((s, i) => (
          <Card key={i} hoverEffect>
            <CardContent className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{s.label}</div>
              <div className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{s.value}</div>
              <div className="text-emerald-600 text-sm font-medium">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Yield vs Risk */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 border-none">
            <CardTitle>Yield vs Salinity Risk by Province</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="yield" fill="#10B981" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Economic */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 border-none">
            <CardTitle>Cumulative Economic Impact (VND billions)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={economicImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#047857" strokeWidth={3} dot={{ fill: '#047857', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2 flex flex-col">
          <CardHeader className="pb-0 border-none">
            <CardTitle>Adoption of AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 min-h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={adoption} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={85} stroke="none">
                    {adoption.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm font-medium text-slate-700">
              {adoption.map((a, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{background: COLORS[idx]}}></div>
                  <span className="truncate">{a.name}</span>
                  <span className="ml-auto font-bold text-slate-900">{a.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader className="pb-4 border-none">
            <CardTitle>Climate Resilience Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Salinity Intrusion Reduction", value: "41%", desc: "vs. 2020 baseline" },
                { label: "Avg Farmer Income Uplift", value: "+₫17.9M", desc: "per season" },
                { label: "Adaptation Rate", value: "79%", desc: "of recommended actions" },
                { label: "CO₂ Reduction (AWD)", value: "18%", desc: "from reduced pumping" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-5 hover:scale-[1.02] transition-transform duration-200">
                  <div className="text-sm font-bold text-slate-900 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold tracking-tight text-primary">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{stat.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
