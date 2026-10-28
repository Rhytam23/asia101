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
import { Button, Badge } from '../components/ui';

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
  const locationData = useMemo(() => demo.isDemoMode && demo.demoData 
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
    : realLocationData, [demo.isDemoMode, demo.demoData, realLocationData]);

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
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Integrated Search Bar inside layout instead of edge-to-edge */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="font-bold tracking-tight text-xl text-slate-900 leading-tight">GIS Mapping</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Satellite Intelligence</div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl mx-auto relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              type="search"
              aria-label="Search location"
              placeholder="Search province, district, commune or lat,lng"
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-24 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
            <Button 
              size="sm"
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg px-4"
            >
              {isSearching ? '...' : 'SEARCH'}
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={resetMap} className="gap-2 h-10">
              <RefreshCw className="w-4 h-4" /> Reset Map
            </Button>
            {demo.isDemoMode && <Badge variant="emerald" className="h-10 px-3">DEMO SCENARIO</Badge>}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 animate-fade-in">
        <div className="flex-1 min-h-[640px] lg:min-h-[680px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <ProfessionalGISMap 
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            height="100%"
          />
        </div>

        <div className="lg:w-[420px] flex-shrink-0">
          {locationData.loading ? (
            <LocationPanelSkeleton />
          ) : (
            <div className="h-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                    document.getElementById('decision-intelligence')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    toast(demo.isDemoMode ? 'DEMO: SMS alert would be sent' : 'SMS alert dispatched');
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Decision Intelligence Engine Section */}
      <div id="decision-intelligence" className="pt-8 pb-8 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <DecisionIntelligence 
            recommendations={recommendations} 
            locationName={locationName}
            loading={locationData.loading}
          />
        </div>

        {/* Economic Decision Module */}
        {recsForEconomic.length > 0 && inputForEconomic && (
          <div className="mt-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <EconomicDecision
                lat={selectedLocation?.lat ?? null}
                lng={selectedLocation?.lng ?? null}
                currentCrop={locationData.crop}
                recommended={recsForEconomic[0]}
                input={inputForEconomic}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
