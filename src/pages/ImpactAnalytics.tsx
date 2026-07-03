import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { provinces } from '../data/mockData';

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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="font-semibold text-4xl tracking-tighter">Impact Analytics</div>
          <div className="text-xl text-slate-500">2026 Season-to-date: Economic and climate outcomes</div>
        </div>
        <div className="px-4 py-2 text-xs rounded-2xl border">Updated 4 minutes ago</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Projected Economic Impact", value: "₫243.4M", sub: "+31% vs last season" },
          { label: "Water Saved", value: "38.2M m³", sub: "Across 19,600 ha" },
          { label: "Yield Improvement", value: "+1.1 t/ha", sub: "Average across pilot" },
        ].map((s, i) => (
          <div key={i} className="card p-6">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="text-[39px] font-semibold tracking-tighter mt-1">{s.value}</div>
            <div className="text-emerald-600 text-xs mt-px">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield vs Risk */}
        <div className="card p-6">
          <div className="font-semibold mb-4">Yield vs Salinity Risk by Province</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="#22C55E" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Economic */}
        <div className="card p-6">
          <div className="font-semibold mb-4">Cumulative Economic Impact (VND billions)</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={economicImpact}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="natural" dataKey="value" stroke="#14532D" strokeWidth={3} dot={{ fill: '#14532D', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
        <div className="md:col-span-2 card p-6">
          <div className="font-semibold mb-4">Adoption of AI Recommendations</div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adoption} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={86} fill="#14532D">
                  {adoption.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 mt-2 text-xs">
            {adoption.map((a, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{background: COLORS[idx]}}></div> {a.name} — {a.value}%
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 card p-6">
          <div className="font-semibold mb-4">Climate Resilience Indicators</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Salinity Intrusion Reduction", value: "41%", desc: "vs. 2020 baseline" },
              { label: "Avg Farmer Income Uplift", value: "+₫17.9M", desc: "per season" },
              { label: "Adaptation Rate", value: "79%", desc: "of recommended actions" },
              { label: "CO₂ Reduction (AWD)", value: "18%", desc: "from reduced pumping" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 border p-4">
                <div className="font-medium">{stat.label}</div>
                <div className="text-3xl font-semibold tracking-tighter text-emerald-700 mt-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
