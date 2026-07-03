import { useState } from 'react';
import { historicalEvents, getHistoricalTimeSeries } from '../data/mockData';
import { HistoricalEvent } from '../types';
import GISMapComponent from '../components/GISMapComponent';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function HistoricalReplay() {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent>(historicalEvents[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackYear, setPlaybackYear] = useState(selectedEvent.year);
  const [currentSimData, setCurrentSimData] = useState(getHistoricalTimeSeries(selectedEvent.year));

  const loadEvent = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setPlaybackYear(event.year);
    setCurrentSimData(getHistoricalTimeSeries(event.year));
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      // Simulate time progression
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const simulatedYear = selectedEvent.year;
        const newData = getHistoricalTimeSeries(simulatedYear).map((p) => ({
          ...p,
          salinity: Math.min(33, p.salinity * (1 + step * 0.05)),
          ndvi: Math.max(0.2, p.ndvi - (step * 0.015)),
        }));
        setCurrentSimData(newData);
        setPlaybackYear(simulatedYear);
        
        if (step > 6) {
          clearInterval(interval);
          setIsPlaying(false);
        }
      }, 900);
    } else {
      setIsPlaying(false);
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentSimData(getHistoricalTimeSeries(selectedEvent.year));
    setPlaybackYear(selectedEvent.year);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-7">
        <div className="font-semibold text-4xl tracking-tighter">Historical Replay</div>
        <div className="text-xl text-slate-500">Simulating 2016 &amp; 2020 Mekong salinity intrusion events</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Event Selector */}
        <div className="xl:col-span-4 card p-6">
          <div className="font-semibold tracking-tight mb-5">SELECT HISTORICAL EVENT</div>

          {historicalEvents.map((event) => (
            <div 
              key={event.id}
              onClick={() => loadEvent(event)}
              className={`border rounded-2xl p-5 mb-3 cursor-pointer transition ${selectedEvent.id === event.id ? 'border-emerald-600 ring-1 ring-emerald-300' : 'hover:border-slate-300'}`}
            >
              <div className="flex items-baseline gap-2">
                <div className="font-semibold text-xl">{event.year}</div>
                <div className="text-xs px-2 py-px bg-red-100 text-red-700 rounded">{event.yieldLoss}% yield loss</div>
              </div>
              <div className="font-semibold tracking-tight mt-px mb-1">{event.name}</div>
              <div className="text-sm leading-tight text-slate-600">{event.description}</div>

              <div className="mt-4 text-xs flex justify-between">
                <div>Peak salinity: <span className="font-semibold">{event.peakSalinity} dS/m</span></div>
                <div className="font-medium">{event.affectedProvinces.length} provinces</div>
              </div>
            </div>
          ))}

          <div className="text-xs px-2 py-2 text-slate-500 mt-1">
            Data derived from MONRE ground truth + Sentinel historical archives.
          </div>
        </div>

        {/* Replay Map + Controls */}
        <div className="xl:col-span-8">
          <div className="card overflow-hidden">
            <div className="px-6 pt-5 pb-3 flex items-center justify-between bg-white">
              <div>
                <span className="font-semibold">Playback: </span> 
                <span className="font-semibold text-red-700">{playbackYear}</span> — {selectedEvent.name}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={togglePlayback} className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-2xl bg-slate-900 text-white">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'PAUSE REPLAY' : 'PLAY CRISIS TIMELINE'}
                </button>
                <button onClick={resetSimulation} className="p-2 rounded-2xl border hover:bg-white"><RotateCcw className="w-4 h-4" /></button>
              </div>
            </div>
            
            <GISMapComponent 
              data={currentSimData} 
              showTimeline={false} 
              height="430px" 
            />
          </div>

          {/* Metrics during replay */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Peak Salinity', val: selectedEvent.peakSalinity + ' dS/m' },
              { label: 'Affected Area', val: selectedEvent.keyMetrics.affectedArea.toLocaleString() + ' ha' },
              { label: 'Yield Loss', val: selectedEvent.yieldLoss + '%' },
              { label: 'Economic Loss', val: (selectedEvent.keyMetrics.economicLoss / 1000) + 'B VND' },
            ].map((m, i) => (
              <div key={i} className="bg-white border rounded-2xl px-5 py-4 text-sm">
                <div className="text-xs text-slate-500">{m.label}</div>
                <div className="font-semibold text-2xl tracking-tighter mt-1">{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 card p-6 text-sm">
        <div className="font-semibold mb-2">Key Insights from {selectedEvent.year}</div>
        <div className="text-slate-600">This event is now used as training data for our salinity prediction model. The current 2026 system has learned to detect similar patterns 14–19 days earlier than the 2020 response.</div>
        <div className="mt-3 text-xs text-emerald-700 font-medium">Validated with: Sentinel-2, MONRE field stations, CHIRPS rainfall</div>
      </div>
    </div>
  );
}
