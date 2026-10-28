import { useState, useEffect } from 'react';
import { mockSMSAlerts, currentSatelliteData, provinces } from '../data/mockData';
import { SMSAlert } from '../types';
import { Send, Clock, CheckCircle } from 'lucide-react';
import GISMapComponent from '../components/GISMapComponent';
import { useDemoMode } from '../context/DemoModeContext';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';

export default function LiveOperations() {
  const [alerts, setAlerts] = useState<SMSAlert[]>(mockSMSAlerts);
  const [sending, setSending] = useState(false);
  const [newAlert, setNewAlert] = useState({ recipient: '', phone: '', message: '' });

  const demo = useDemoMode();
  const [livePoints, setLivePoints] = useState(currentSatelliteData);

  // DEMO MODE: override live data with scenario values
  const effectiveLivePoints = (demo.isDemoMode && demo.demoData)
    ? currentSatelliteData.map(p => ({
        ...p,
        salinity: demo.demoData!.soil.salinity,
        rainfall: demo.demoData!.weather.current.rainfall,
        temperature: demo.demoData!.weather.current.temp,
      }))
    : livePoints;

  // Demo SMS preview
  const demoSmsMessage = demo.isDemoMode && demo.demoData 
    ? demo.demoData.smsPreview 
    : null;

  useEffect(() => {
    // DEMONSTRATION live stream (deterministic variation)
    let tick = 0;
    const interval = setInterval(() => {
      tick = (tick + 1) % 9;
      setLivePoints(prev => prev.map((p, i) => ({
        ...p,
        salinity: Math.max(0.5, Math.min(13, p.salinity + ((tick + i) % 7 - 3) * 0.28)),
        rainfall: Math.max(3, Math.min(72, p.rainfall + ((tick * 2 + i) % 5 - 2) * 1.4)),
      })));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const sendNewAlert = () => {
    if (!newAlert.recipient || !newAlert.phone) return;
    
    setSending(true);
    setTimeout(() => {
      const alert: SMSAlert = {
        id: `sms-${Date.now()}`,
        recipient: newAlert.recipient,
        phone: newAlert.phone,
        message: newAlert.message || `URGENT: Salinity update for your area. Check full analysis on mekong.ai. Priority: HIGH.`,
        timestamp: new Date().toISOString().slice(0,16).replace('T', ' '),
        priority: 'high',
        status: 'sent',
      };
      setAlerts(prev => [alert, ...prev]);
      setNewAlert({ recipient: '', phone: '', message: '' });
      setSending(false);
    }, 650);
  };

  const markDelivered = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'delivered' } : a));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="red">LIVE</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Operations Center</h1>
          </div>
          <p className="text-slate-500">Real-time monitoring, alerting and dispatch</p>
        </div>
        <Badge variant="emerald" className="gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          12,983 active sessions
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        {/* Live Map + Stats */}
        <Card className="xl:col-span-7 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Live Satellite Feed</CardTitle>
              <div className="text-xs text-slate-500 mt-1">Updating every 3.8s • 10 provinces</div>
            </div>
            <div className="text-xs flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> LIVE DATA STREAM
            </div>
          </CardHeader>
          <div className="flex-1 min-h-[410px]">
            <GISMapComponent data={effectiveLivePoints} showTimeline={false} height="100%" />
          </div>
        </Card>

        {/* Operations Stats */}
        <div className="xl:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-sm text-slate-500 uppercase tracking-wider">Operations Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Farmers Monitored", val: "278,900", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
                  { label: "Current Alerts", val: "14", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
                  { label: "SMS Sent Today", val: "3,174", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
                  { label: "Avg Response Time", val: "41s", color: "text-slate-900", bg: "bg-slate-50 border-slate-100" },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-xl px-4 py-4 border transition-all hover:scale-[1.02] ${item.bg}`}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
                    <div className={`font-bold text-2xl ${item.color}`}>{item.val}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-none">
              <CardTitle className="text-sm text-slate-500 uppercase tracking-wider">High Risk Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                {provinces.filter(p => p.salinityRisk > 75).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 font-bold text-slate-900">{p.name}</div>
                    <div className="text-red-600 font-semibold">{p.salinityRisk}% salinity risk</div>
                    <Badge variant="red">ACTIVE</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SMS Alert System */}
        <div className="xl:col-span-12">
          <div className="flex items-center justify-between mb-6 mt-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">SMS Alert Engine</h2>
            <Button variant="ghost" size="sm" onClick={() => setAlerts(mockSMSAlerts)}>
              Reset Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Send New */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 border-none">
                <CardTitle>Dispatch New Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input 
                  value={newAlert.recipient}
                  onChange={(e) => setNewAlert({...newAlert, recipient: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  aria-label="Recipient name"
                  placeholder="Recipient name" 
                />
                <input 
                  value={newAlert.phone}
                  onChange={(e) => setNewAlert({...newAlert, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  aria-label="Phone number"
                  type="tel"
                  placeholder="+84 9xx xxx xxx" 
                />
                <textarea 
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm h-24 resize-y outline-none transition-all"
                  aria-label="Alert message"
                  placeholder="Custom alert text (optional)" 
                />
                <Button 
                  disabled={sending || !newAlert.recipient || !newAlert.phone}
                  onClick={sendNewAlert}
                  className="w-full gap-2"
                >
                  <Send className="w-4 h-4" /> {sending ? 'SENDING...' : 'SEND SMS ALERT'}
                </Button>
                <div className="text-[10px] text-center text-slate-500 uppercase tracking-wide">
                  Preview shown below • Production uses authenticated SMS gateway
                </div>
              </CardContent>
            </Card>

            {/* Alerts Feed */}
            <Card className="lg:col-span-3 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
                <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">RECENT ALERTS</CardTitle>
                <Badge variant="slate">{alerts.length}</Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-900">{alert.recipient}</span>
                          <span className="text-xs text-slate-500 ml-2">• {alert.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.status === 'delivered' ? (
                            <span className="text-emerald-700 flex items-center text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3 mr-1" /> DELIVERED
                            </span>
                          ) : (
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 py-0" onClick={() => markDelivered(alert.id)}>
                              MARK DELIVERED
                            </Button>
                          )}
                          <Badge variant={alert.priority === 'high' ? 'red' : 'amber'} className="uppercase">
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {demoSmsMessage || alert.message}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-3">{alert.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
