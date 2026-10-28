import { WeatherData } from '../services/weatherService';
import { SoilData } from '../services/soilService';
import { AdminData } from '../services/adminService';
import { CropData } from '../services/cropService';
import { MarketData } from '../services/marketService';
import { GovernmentData } from '../services/governmentService';

interface Props {
  lat: number | null;
  lng: number | null;
  admin: AdminData | null;
  weather: WeatherData | null;
  soil: SoilData | null;
  crop: CropData | null;
  market: MarketData | null;
  government: GovernmentData | null;
  loading: boolean;
  onApply?: (action: string) => void;
}

function MetaBadge({ source, lastUpdated, confidence }: { source: string; lastUpdated: string; confidence: number }) {
  const date = new Date(lastUpdated);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="text-[10px] flex flex-wrap items-center gap-x-2 text-slate-500 mt-1">
      <span>{source}</span>
      <span>•</span>
      <span>Updated {time}</span>
      <span>•</span>
      <span className="font-medium text-emerald-700">{confidence}% confidence</span>
    </div>
  );
}

export default function GISLocationPanel({ 
  lat, lng, admin, weather, soil, crop, market, government, loading, onApply 
}: Props) {

  if (loading) {
    return (
      <div className="card h-full min-h-[240px] flex items-center justify-center p-8" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3 text-emerald-700">
          <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
          <div className="text-sm font-medium">Fetching live data for location...</div>
        </div>
      </div>
    );
  }

  if (!admin && !weather) {
    return (
      <div className="card h-full min-h-[240px] flex flex-col items-center justify-center gap-3 p-8 text-center text-sm text-slate-500">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl" aria-hidden>📍</div>
        <div className="font-medium text-slate-700">No location selected</div>
        <div>Click anywhere on the map or search to load weather, soil, market and policy data.</div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b bg-white">
        <div className="text-xs uppercase tracking-[1px] font-semibold text-emerald-700 mb-0.5">SELECTED LOCATION</div>
        
        {admin ? (
          <>
            <div className="font-semibold text-2xl tracking-tighter">{admin.province}</div>
            <div className="text-sm text-slate-600">{admin.district} • {admin.commune}</div>
            <div className="mt-1 text-xs text-emerald-800 font-mono">
              {lat !== null ? lat.toFixed(4) : '—'}°N, {lng !== null ? lng.toFixed(4) : '—'}°E
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-500">Loading administrative data...</div>
        )}

        {admin && <MetaBadge source={admin.source} lastUpdated={admin.lastUpdated} confidence={admin.confidence} />}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-5 text-sm">
        
        {/* WEATHER */}
        {weather && (
          <div>
            <div className="flex items-baseline justify-between">
              <div className="font-semibold text-xs uppercase tracking-wider text-slate-500">WEATHER</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-3 transition-colors hover:bg-orange-50">
                <div className="text-xs font-medium text-orange-600/80 uppercase tracking-wider mb-0.5">Temperature</div>
                <div className="text-2xl font-semibold text-orange-900">{weather.current.temp}°C</div>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3 transition-colors hover:bg-blue-50">
                <div className="text-xs font-medium text-blue-600/80 uppercase tracking-wider mb-0.5">Humidity</div>
                <div className="text-2xl font-semibold text-blue-900">{weather.current.humidity}%</div>
              </div>
              <div className="bg-teal-50/80 border border-teal-100 rounded-2xl p-3 transition-colors hover:bg-teal-50">
                <div className="text-xs font-medium text-teal-600/80 uppercase tracking-wider mb-0.5">Wind</div>
                <div className="text-2xl font-semibold text-teal-900">{weather.current.wind} km/h</div>
              </div>
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 transition-colors hover:bg-indigo-50">
                <div className="text-xs font-medium text-indigo-600/80 uppercase tracking-wider mb-0.5">Rainfall</div>
                <div className="text-2xl font-semibold text-indigo-900">{weather.current.rainfall} mm</div>
              </div>
            </div>
            <div className="text-xs mt-1 text-slate-600">{weather.current.condition}</div>
            <MetaBadge source={weather.source} lastUpdated={weather.lastUpdated} confidence={weather.confidence} />
          </div>
        )}

        {/* SOIL */}
        {soil && (
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1">SOIL</div>
            <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-sm text-amber-900 transition-colors hover:bg-amber-50">
              <div className="grid grid-cols-2 gap-y-1">
                <div className="text-amber-700/80">Type</div><div className="font-medium">{soil.type}</div>
                <div className="text-amber-700/80">pH</div><div className="font-medium">{soil.ph}</div>
                <div className="text-amber-700/80">Salinity</div><div className="font-medium">{soil.salinity} dS/m</div>
                <div className="text-amber-700/80">Organic Matter</div><div className="font-medium">{soil.organicMatter}%</div>
              </div>
            </div>
            <MetaBadge source={soil.source} lastUpdated={soil.lastUpdated} confidence={soil.confidence} />
          </div>
        )}

        {/* GROUNDWATER / RISKS (synthetic from soil + weather for now) */}
        {soil && weather && (
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1">RISKS &amp; GROUNDWATER</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="px-3 py-2 border border-sky-100 rounded-2xl bg-sky-50/80 text-sky-900 transition-colors hover:bg-sky-50">
                Flood Risk: <span className="font-semibold text-sky-700">~{Math.round(35 + soil.salinity * 3)}%</span>
              </div>
              <div className="px-3 py-2 border border-amber-100 rounded-2xl bg-amber-50/80 text-amber-900 transition-colors hover:bg-amber-50">
                Drought Risk: <span className="font-semibold text-amber-700">~{Math.round(18 + (100 - weather.current.humidity) / 2)}%</span>
              </div>
              <div className="px-3 py-2 border border-cyan-100 rounded-2xl bg-cyan-50/80 text-cyan-900 transition-colors hover:bg-cyan-50">
                Groundwater: <span className="font-semibold text-cyan-700">{(1.35 + ((lat || 10) * 0.11) % 1.65).toFixed(1)}m</span>
              </div>
              <div className="px-3 py-2 border border-red-100 rounded-2xl bg-red-50/80 text-red-900 transition-colors hover:bg-red-50">
                Salinity Intrusion: <span className="font-semibold text-red-700">{Math.round(soil.salinity * 8)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* CURRENT CROP */}
        {crop && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="font-semibold text-xs uppercase tracking-wider text-emerald-700">CURRENT CROP &amp; SEASON</div>
            <div className="mt-1 font-semibold text-lg">{crop.current}</div>
            <div className="text-emerald-700 text-sm">{crop.stage} • Day {crop.daysSincePlanting}</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium">{crop.season}</div>
            <MetaBadge source={crop.source} lastUpdated={crop.lastUpdated} confidence={crop.confidence} />
          </div>
        )}

        {/* MARKET */}
        {market && (
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1">MARKET PRICES</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-2 text-emerald-900 transition-colors hover:bg-emerald-50">
                <span className="text-emerald-700/80">Rice</span><br /><span className="font-semibold text-sm">{market.ricePrice.toLocaleString()}</span> <span className="text-[10px]">VND</span>
              </div>
              <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-2 text-rose-900 transition-colors hover:bg-rose-50">
                <span className="text-rose-700/80">Shrimp</span><br /><span className="font-semibold text-sm">{market.shrimpPrice.toLocaleString()}</span>
              </div>
              <div className="bg-lime-50/80 border border-lime-100 rounded-2xl p-2 text-lime-900 transition-colors hover:bg-lime-50">
                <span className="text-lime-700/80">Veg.</span><br /><span className="font-semibold text-sm">{market.vegetablePrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs mt-1 text-emerald-700 font-medium">{market.trend}</div>
            <MetaBadge source={market.source} lastUpdated={market.lastUpdated} confidence={market.confidence} />
          </div>
        )}

        {/* GOVERNMENT */}
        {government && (
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-1">GOVERNMENT PROGRAMS</div>
            <div className="text-xs bg-violet-50/80 border border-violet-100 rounded-2xl p-3 space-y-1 text-violet-900 transition-colors hover:bg-violet-50">
              {government.programs.map((p, i) => <div key={i}>• {p}</div>)}
              {government.alerts.length > 0 && (
                <div className="pt-1 border-t text-amber-700">Alerts: {government.alerts.join(', ')}</div>
              )}
            </div>
            <MetaBadge source={government.source} lastUpdated={government.lastUpdated} confidence={government.confidence} />
          </div>
        )}
      </div>

      <div className="border-t px-4 py-3.5 flex gap-2 bg-white">
        <button onClick={() => onApply?.('recommend')} className="flex-1 py-2.5 bg-primary hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-2xl transition-colors">
          GET CROP RECOMMENDATIONS
        </button>
        <button onClick={() => onApply?.('sms')} className="flex-1 py-2.5 border hover:bg-slate-50 text-xs sm:text-sm font-semibold rounded-2xl transition-colors">
          DISPATCH SMS
        </button>
      </div>
    </div>
  );
}
