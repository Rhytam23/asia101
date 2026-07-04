import { Link } from 'react-router-dom';
import { Activity, MapPin, TrendingUp, AlertTriangle, Users, Clock, ArrowRight, Cloud, LineChart } from 'lucide-react';
import PipelineVisualizer from '../components/PipelineVisualizer';
import { currentSatelliteData, mockRecommendations, provinces } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function MissionControl() {
  const { hasRole } = useAuth();
  
  const liveMetrics = {
    points: currentSatelliteData.length,
    provinces: provinces.length,
    avgSalinity: (currentSatelliteData.reduce((a, b) => a + b.salinity, 0) / currentSatelliteData.length).toFixed(1),
    highRisk: currentSatelliteData.filter(p => p.salinity > 6).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="emerald">LIVE • 03 JUL 2026</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mission Control</h1>
          </div>
          <p className="text-slate-500">Real-time satellite data ingestion & decision pipeline</p>
        </div>
        <Link to="/live-ops">
          <Button variant="outline" className="gap-2">
            Open Live Operations <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        {/* Live Status */}
        <Card className="xl:col-span-12 border-emerald-100 shadow-emerald-900/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <div>
              <CardTitle>Live Operations Status</CardTitle>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ALL SYSTEMS NOMINAL
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm text-emerald-700 font-semibold">+ 5,312 pts</div>
              <div className="text-xs text-slate-500">last 90 mins</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Satellite Points', value: liveMetrics.points, icon: MapPin },
                { label: 'Provinces Covered', value: liveMetrics.provinces, icon: Users },
                { label: 'Avg Salinity', value: `${liveMetrics.avgSalinity} dS/m`, icon: TrendingUp },
                { label: 'High Risk Zones', value: liveMetrics.highRisk, icon: AlertTriangle },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <Icon className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-500 mb-1">{m.label}</div>
                      <div className="text-xl font-bold tracking-tight text-slate-900">{m.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs flex flex-wrap gap-x-6 text-slate-500">
              <div><span className="font-medium text-slate-800">6</span> Data Sources</div>
              <div><span className="font-medium text-slate-800">98.3%</span> Data Validity</div>
              <div><span className="font-medium text-slate-800">42s</span> Latency</div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Visualizer */}
        {hasRole(['Government', 'Research']) && (
          <Card className="xl:col-span-12 bg-slate-50 overflow-hidden">
            <PipelineVisualizer autoPlay={true} />
          </Card>
        )}

        {/* Quick Links */}
        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link to="/ai-engine">
            <Card hoverEffect className="h-full border-slate-200 group cursor-pointer flex flex-col p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">AI Decision Engine</h3>
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl mt-4">
                <div className="text-2xl font-bold tracking-tight">94%</div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">Avg Confidence</div>
              </div>
            </Card>
          </Link>

          {hasRole(['Cooperative', 'Government', 'Research']) && (
            <>
              <Link to="/gis-map">
                <Card hoverEffect className="h-full border-slate-200 group cursor-pointer flex flex-col p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">Interactive GIS Map</h3>
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mt-4">
                    <div className="text-2xl font-bold tracking-tight">12</div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">Active Provinces</div>
                  </div>
                </Card>
              </Link>
              <Link to="/historical">
                <Card hoverEffect className="h-full border-slate-200 group cursor-pointer flex flex-col p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">Historical Replay</h3>
                  <div className="bg-amber-50 text-amber-700 p-3 rounded-xl mt-4">
                    <div className="text-2xl font-bold tracking-tight">2</div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">Crisis Models</div>
                  </div>
                </Card>
              </Link>
            </>
          )}

          {hasRole(['Farmer']) && (
            <>
              <Link to="/market-intelligence">
                <Card hoverEffect className="h-full border-slate-200 group cursor-pointer flex flex-col p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                      <LineChart className="w-6 h-6" />
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">Yield & Market Price</h3>
                  <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl mt-4 flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold tracking-tight">4.2<span className="text-sm">t/ha</span></div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">Est. Yield</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold tracking-tight text-emerald-600">+$120/t</div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5 text-slate-600">Market Trend</div>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/live-ops">
                <Card hoverEffect className="h-full border-slate-200 group cursor-pointer flex flex-col p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">Local Weather</h3>
                  <div className="bg-sky-50 text-sky-700 p-3 rounded-xl mt-4 flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold tracking-tight">28°C</div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">Partly Cloudy</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold tracking-tight text-blue-600">30%</div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5 text-slate-600">Rain Prob.</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </>
          )}
        </div>

        {/* Top Recommendations */}
        <div className="xl:col-span-12 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Latest AI Recommendations</h2>
            <Link to="/ai-engine">
              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                View Full Engine <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRecommendations.map((rec, idx) => (
              <Card key={idx} hoverEffect className={`flex flex-col justify-between ${rec.confidence > 90 ? 'border-emerald-200' : 'border-amber-200'}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 leading-tight">{rec.title}</h3>
                    <Badge variant={rec.confidence > 90 ? 'emerald' : 'amber'}>{rec.confidence}%</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">{rec.predictedOutcome}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-sm font-bold text-primary">+{rec.expectedYield} t/ha</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">Yield</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{rec.waterSavings}%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">Saved</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{rec.expectedIncome}M</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">Uplift</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
