import { useState } from 'react';
import { historicalEvents, getHistoricalTimeSeries } from '../data/mockData';
import { HistoricalEvent } from '../types';
import GISMapComponent from '../components/GISMapComponent';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';

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
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight text-slate-900 mb-2">Historical Replay</h1>
        <p className="text-slate-500">Simulating 2016 & 2020 Mekong salinity intrusion events</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        {/* Event Selector */}
        <div className="xl:col-span-4 flex flex-col h-full animate-slide-in-right">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-4 border-none">
              <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Select Historical Event</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              {historicalEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => loadEvent(event)}
                  className={`border rounded-2xl p-5 cursor-pointer transition-all ${selectedEvent.id === event.id ? 'border-primary ring-1 ring-primary/20 bg-emerald-50/30' : 'hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="font-bold text-2xl text-slate-900">{event.year}</h3>
                    <Badge variant="red">{event.yieldLoss}% yield loss</Badge>
                  </div>
                  <h4 className="font-bold tracking-tight text-slate-800 mb-2">{event.name}</h4>
                  <p className="text-sm leading-relaxed text-slate-600 mb-4">{event.description}</p>

                  <div className="text-xs font-medium flex justify-between pt-4 border-t border-slate-100">
                    <div className="text-slate-500">Peak salinity: <span className="font-bold text-slate-900">{event.peakSalinity} dS/m</span></div>
                    <div className="text-slate-500">{event.affectedProvinces.length} provinces</div>
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-4 text-xs text-center text-slate-400 font-medium">
                Data derived from MONRE ground truth + Sentinel historical archives.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Replay Map + Controls */}
        <div className="xl:col-span-8 flex flex-col h-full gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-white z-10 border-b border-slate-100">
              <div className="text-sm">
                <span className="font-bold text-slate-900">Playback: </span> 
                <span className="font-bold text-red-600">{playbackYear}</span> <span className="text-slate-500">— {selectedEvent.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={togglePlayback} size="sm" className="gap-2">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'PAUSE REPLAY' : 'PLAY CRISIS TIMELINE'}
                </Button>
                <Button variant="outline" size="sm" onClick={resetSimulation} className="px-3">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <div className="flex-1 min-h-[430px]">
              <GISMapComponent 
                data={currentSimData} 
                showTimeline={false} 
                height="100%" 
              />
            </div>
          </Card>

          {/* Metrics during replay */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            {[
              { label: 'Peak Salinity', val: selectedEvent.peakSalinity + ' dS/m', colors: 'bg-red-50 border-red-200', titleColor: 'text-red-600', valColor: 'text-red-900' },
              { label: 'Affected Area', val: selectedEvent.keyMetrics.affectedArea.toLocaleString() + ' ha', colors: 'bg-amber-50 border-amber-200', titleColor: 'text-amber-600', valColor: 'text-amber-900' },
              { label: 'Yield Loss', val: selectedEvent.yieldLoss + '%', colors: 'bg-orange-50 border-orange-200', titleColor: 'text-orange-600', valColor: 'text-orange-900' },
              { label: 'Economic Loss', val: (selectedEvent.keyMetrics.economicLoss / 1000) + 'B VND', colors: 'bg-rose-50 border-rose-200', titleColor: 'text-rose-600', valColor: 'text-rose-900' },
            ].map((m, i) => (
              <Card key={i} hoverEffect className={`${m.colors}`}>
                <CardContent className="p-4">
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${m.titleColor}`}>{m.label}</div>
                  <div className={`font-bold text-2xl tracking-tight ${m.valColor}`}>{m.val}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-emerald-50 border-emerald-100">
        <CardContent className="p-6">
          <h4 className="font-bold text-emerald-900 mb-2">Key Insights from {selectedEvent.year}</h4>
          <p className="text-emerald-800 text-sm leading-relaxed mb-4">
            This event is now used as training data for our salinity prediction model. The current 2026 system has learned to detect similar patterns 14–19 days earlier than the 2020 response.
          </p>
          <div className="text-xs font-bold text-emerald-700 tracking-wide">
            VALIDATED WITH: SENTINEL-2, MONRE FIELD STATIONS, CHIRPS RAINFALL
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
