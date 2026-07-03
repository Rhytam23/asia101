import { useState } from 'react';
import GISMapComponent from '../components/GISMapComponent';
import { SatelliteDataPoint } from '../types';
import { currentSatelliteData, provinces } from '../data/mockData';
import { MapPin, Layers } from 'lucide-react';

export default function GISMap() {
  const [selectedPoint, setSelectedPoint] = useState<SatelliteDataPoint | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'layers'>('map');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-semibold text-4xl tracking-tighter">Interactive GIS Map</div>
          <div className="text-xl text-slate-500 mt-1">Mekong Delta • Multi-layer satellite intelligence</div>
        </div>
        <div className="text-sm px-4 py-1.5 rounded-3xl bg-white border text-slate-600 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> 28,670 ha • 10 provinces
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <GISMapComponent 
            data={currentSatelliteData} 
            showTimeline={true} 
            height="700px"
            onPointSelect={setSelectedPoint} 
          />
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="card p-6">
            <div className="uppercase text-xs tracking-wider font-semibold text-slate-500 mb-4">MAP CONTROLS</div>
            
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('map')} 
                className={`flex-1 py-2 text-sm rounded-2xl font-medium ${activeTab === 'map' ? 'bg-primary text-white' : 'border hover:bg-slate-50'}`}
              >
                Layers &amp; Data
              </button>
              <button 
                onClick={() => setActiveTab('layers')} 
                className={`flex-1 py-2 text-sm rounded-2xl font-medium ${activeTab === 'layers' ? 'bg-primary text-white' : 'border hover:bg-slate-50'}`}
              >
                Climate Layers
              </button>
            </div>

            {activeTab === 'map' && (
              <div>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium mb-2 text-xs tracking-wider">PROVINCE OVERVIEW</div>
                    <div className="grid grid-cols-2 gap-2">
                      {provinces.slice(0, 6).map(p => (
                        <div key={p.id} className="border text-xs rounded-2xl px-3 py-2">
                          <div className="font-medium">{p.name}</div>
                          <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
                            <span>Risk: {p.salinityRisk}%</span> 
                            <span>NDVI {p.ndviAvg}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs bg-emerald-50 border-emerald-100 border rounded-2xl p-3 leading-snug">
                    <strong>Tip:</strong> Click any marker on the map to inspect detailed satellite readings and trigger AI analysis.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="text-sm">
                <div className="text-emerald-700 font-medium mb-3">Satellite Layer Legend</div>
                <div className="space-y-[13px]">
                  {[
                    { color: '#DC2626', label: 'High Salinity (>7 dS/m)', source: 'Sentinel-1 SAR' },
                    { color: '#F59E0B', label: 'Medium Salinity (4-7)', source: 'Sentinel-1 + MONRE' },
                    { color: '#22C55E', label: 'Healthy Vegetation (NDVI >0.7)', source: 'Sentinel-2' },
                    { color: '#3B82F6', label: 'Recent Rainfall (>50mm)', source: 'CHIRPS' },
                  ].map((l, i) => (
                    <div key={i} className="flex gap-2.5 items-center">
                      <div className="w-4 h-4 rounded" style={{ background: l.color }}></div>
                      <div className="flex-1">
                        <div>{l.label}</div>
                        <div className="text-xs text-slate-500">{l.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Point Inspector */}
          {selectedPoint && (
            <div className="card p-6 border-emerald-200">
              <div className="font-semibold mb-4 flex justify-between">
                POINT INSPECTION
                <button onClick={() => setSelectedPoint(null)} className="text-xs text-emerald-700">CLEAR</button>
              </div>
              
              <div className="text-sm mb-3">
                <span className="font-mono text-xs text-slate-400">LAT/LNG:</span> {selectedPoint.lat}, {selectedPoint.lng}
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>Salinity</div><div className="font-semibold text-right">{selectedPoint.salinity} dS/m</div>
                <div>NDVI</div><div className="font-semibold text-right">{selectedPoint.ndvi}</div>
                <div>Rainfall</div><div className="font-semibold text-right">{selectedPoint.rainfall} mm</div>
                <div>Soil Moisture</div><div className="font-semibold text-right">{selectedPoint.soilMoisture}%</div>
                <div>Groundwater</div><div className="font-semibold text-right">{selectedPoint.groundwater} m</div>
              </div>

              <div className="mt-6 pt-4 border-t text-xs">
                <div className="text-slate-500">Source: <span className="font-medium text-slate-700">{selectedPoint.source}</span></div>
                <div className="text-slate-500">Timestamp: {selectedPoint.timestamp}</div>
              </div>

              <button 
                onClick={() => window.location.href = '/ai-engine'} 
                className="mt-5 w-full bg-primary text-white py-2.5 rounded-2xl text-sm font-semibold hover:bg-emerald-900"
              >
                Run AI Analysis on This Location
              </button>
            </div>
          )}

          {!selectedPoint && (
            <div className="card p-6 text-sm text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 mb-3">
                <Layers className="w-4 h-4" /> HOW TO USE
              </div>
              <ul className="list-disc pl-5 space-y-[3px] text-xs leading-relaxed">
                <li>Toggle layers in top-right panel</li>
                <li>Use timeline at bottom to replay last 7 days</li>
                <li>Click any marker to view readings + open AI engine</li>
                <li>Province polygons show risk boundaries</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
