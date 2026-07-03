import { useState, useMemo } from 'react';
import ProfessionalGISMap from '../components/ProfessionalGISMap';
import GISLocationPanel from '../components/GISLocationPanel';
import DecisionIntelligence from '../components/DecisionIntelligence';
import EconomicDecision from '../components/EconomicDecision';
import { useLocationData } from '../hooks/useLocationData';
import { generateRecommendations } from '../services/decisionEngine';
import { DecisionInput } from '../types/recommendation';
import { CropRecommendation } from '../types/recommendation';
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { LocationPanelSkeleton } from '../components/shared/LoadingStates';
import { useDemoMode } from '../context/DemoModeContext';

export default function SmartMap() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recsState, setRecsState] = useState<CropRecommendation[]>([]);
  const [inputState, setInputState] = useState<DecisionInput | null>(null);

  const demo = useDemoMode();

  // When demo mode is active, use demo location + data
  const effectiveLat = demo.isDemoMode && demo.demoData ? demo.demoData.location.lat : selectedLocation?.lat ?? null;
  const effectiveLng = demo.isDemoMode && demo.demoData ? demo.demoData.location.lng : selectedLocation?.lng ?? null;

  const realLocationData = useLocationData(effectiveLat, effectiveLng);

  // When demo mode is active, completely override with scenario data
  const locationData = demo.isDemoMode && demo.demoData 
    ? {
        ...realLocationData,
        admin: demo.demoData.admin,
        weather: demo.demoData.weather,
        soil: demo.demoData.soil,
        crop: demo.demoData.crop,
        market: demo.demoData.market,
        government: demo.demoData.government,
        loading: false,
        error: null,
      }
    : realLocationData;

  // Memoized decision input for performance (no unnecessary state churn)
  const decisionInput: DecisionInput | null = useMemo(() => {
    if (demo.isDemoMode && demo.demoData) {
      return demo.demoData.decisionInput;
    }
    if (!selectedLocation || !locationData.admin || !locationData.soil || !locationData.weather) {
      return null;
    }
    return {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      admin: locationData.admin,
      weather: locationData.weather,
      soil: locationData.soil,
      crop: locationData.crop,
      market: locationData.market,
      government: locationData.government,
      groundwater: { depth: locationData.soil ? (2.0 + ((selectedLocation.lat * 100 + selectedLocation.lng * 10) % 16) / 10) : 2.1 },
    };
  }, [selectedLocation, locationData, demo.isDemoMode, demo.demoData]);

  // Memoized recommendations — derived directly
  const recommendations: CropRecommendation[] = useMemo(() => {
    if (demo.isDemoMode && demo.demoData) {
      return demo.demoData.recommendations;
    }
    if (!decisionInput) return [];
    return generateRecommendations(decisionInput);
  }, [decisionInput, demo.isDemoMode, demo.demoData]);

  // Minimal sync for EconomicDecision (avoids prop drilling changes)
  const recsForEconomic = recsState.length > 0 ? recsState : recommendations;
  const inputForEconomic = inputState || decisionInput;

  const handleLocationSelect = (lat: number, lng: number, _meta?: any) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      let lat = 10.25;
      let lng = 105.6;
      let found = false;

      const coordMatch = q.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
      if (coordMatch) {
        lat = parseFloat(coordMatch[1]);
        lng = parseFloat(coordMatch[2]);
        found = true;
      } else {
        const provinceMatches: Record<string, [number, number]> = {
          'an giang': [10.52, 105.13], 'chau doc': [10.52, 105.13],
          'dong thap': [10.46, 105.63], 'kien giang': [9.95, 105.15],
          'rach gia': [9.95, 105.15], 'soc trang': [9.60, 105.98],
          'ben tre': [10.23, 106.37], 'tra vinh': [9.93, 106.34],
          'can tho': [10.04, 105.75], 'vinh long': [10.25, 105.97],
          'tien giang': [10.35, 106.36], 'long an': [10.65, 106.26],
        };
        for (const [key, coords] of Object.entries(provinceMatches)) {
          if (q.includes(key)) {
            lat = coords[0] +  ((Date.now() % 9 - 4) * 0.016);
            lng = coords[1] +  ((Date.now() % 11 - 5) * 0.018);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        // Deterministic fallback
        const seed = q.length + searchQuery.length;
        lat = 9.9 + ((seed % 13) / 13) * 1.6;
        lng = 105.0 + ((seed % 17) / 17) * 1.8;
      }

      handleLocationSelect(lat, lng);
      setSearchQuery('');
      setIsSearching(false);
    }, 380);
  };

  const resetMap = () => {
    setSelectedLocation(null);
    setRecsState([]);
    setInputState(null);
    toast.info('Map selection cleared');
  };

  const locationName = (demo.isDemoMode && demo.demoData)
    ? demo.demoData.location.name
    : locationData.admin 
      ? `${locationData.admin.province} — ${locationData.admin.district}` 
      : 'Selected Location';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="border-b bg-white z-50">
        <div className="max-w-[1520px] mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center">
              <MapPin className="text-white w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold tracking-tighter text-3xl text-primary">MEKONG GIS</div>
              <div className="text-[10px] text-emerald-700 -mt-1 font-medium">PROFESSIONAL SATELLITE INTELLIGENCE</div>
            </div>
          </div>

          <div className="flex-1 max-w-md ml-2">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search province, district, commune or lat,lng"
                className="w-full border pl-10 py-2.5 text-sm rounded-3xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1.5 top-1.5 text-xs bg-primary text-white px-5 py-[5px] rounded-3xl font-medium disabled:opacity-60"
              >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={resetMap} className="flex items-center gap-1.5 text-sm px-4 py-2 border rounded-2xl hover:bg-white">
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="text-xs px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-medium">
              {demo.isDemoMode ? 'DEMO SCENARIO ACTIVE' : 'Map click triggers full analysis'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1520px] mx-auto w-full px-4 pt-4 gap-4">
        <div className="flex-1 min-h-[640px] lg:min-h-[680px] relative">
          <ProfessionalGISMap 
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            height="100%"
          />
        </div>

        <div className="lg:w-[400px] xl:w-[430px] flex-shrink-0">
          {locationData.loading ? (
            <LocationPanelSkeleton />
          ) : (
            <GISLocationPanel 
              lat={effectiveLat}
              lng={effectiveLng}
              admin={locationData.admin}
              weather={locationData.weather}
              soil={locationData.soil}
              crop={locationData.crop}
              market={locationData.market}
              government={locationData.government}
              loading={locationData.loading}
              onApply={(action) => {
                if (action === 'recommend' && recommendations.length) {
                  window.scrollTo({ top: 900, behavior: 'smooth' });
                } else {
                  toast(demo.isDemoMode ? 'DEMO: SMS alert would be sent' : 'SMS alert dispatched');
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Decision Intelligence Engine Section — appears automatically */}
      <div className="max-w-[1520px] mx-auto w-full px-4 pt-4 pb-8">
        <DecisionIntelligence 
          recommendations={recommendations} 
          locationName={locationName}
          loading={locationData.loading}
        />

        {/* Economic Decision Module — live comparison with charts */}
        {recsForEconomic.length > 0 && inputForEconomic && (
          <div className="mt-6">
            <EconomicDecision
              lat={selectedLocation?.lat ?? null}
              lng={selectedLocation?.lng ?? null}
              currentCrop={locationData.crop}
              recommended={recsForEconomic[0]}
              input={inputForEconomic}
            />
          </div>
        )}
      </div>

      <div className="border-t bg-white py-3 px-6 text-xs text-slate-500 flex items-center gap-5 max-w-[1520px] mx-auto w-full">
        <div>Decision Engine v1.0 — Weather • Soil • Salinity • Groundwater • Market • Rotation</div>
        <div className="ml-auto">All recommendations include full reasoning + supporting evidence</div>
      </div>
    </div>
  );
}
