import { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import {
  TrendingUp, DollarSign, MapPin, 
  Bell, Activity, AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight,
  Clock, LineChart as LineChartIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import {
  historicalPriceData, currentMarketInfo, marketTrends, 
  aiRecommendation, nearbyMarkets
} from '../data/mockMarketData';

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

export default function MarketIntelligence() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const filteredChartData = useMemo(() => {
    const now = new Date('2026-07-04'); // Using the end date of the mock data generator
    let daysToSubtract = 30;
    
    switch(timeRange) {
      case '1W': daysToSubtract = 7; break;
      case '1M': daysToSubtract = 30; break;
      case '3M': daysToSubtract = 90; break;
      case '6M': daysToSubtract = 180; break;
      case '1Y': daysToSubtract = 365; break;
    }
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysToSubtract);
    
    return historicalPriceData.filter(d => new Date(d.date) >= startDate);
  }, [timeRange]);

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-lg">
          <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
          <p className="text-emerald-700 font-bold text-lg">
            {formatCurrency(payload[0].value)}/t
          </p>
        </div>
      );
    }
    return null;
  };

  const revenueToday = currentMarketInfo.expectedYield * currentMarketInfo.currentPrice;
  const revenueNextWeek = currentMarketInfo.expectedYield * aiRecommendation.predictedPriceNextWeek;
  const revenueDiff = revenueNextWeek - revenueToday;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="emerald" className="bg-emerald-100 text-emerald-800">Demo Data</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Market Intelligence</h1>
          </div>
          <p className="text-slate-500">Live commodity tracking & revenue optimization</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Selected Crop</p>
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <span className="font-bold text-slate-800">{currentMarketInfo.cropName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main KPI Row */}
        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-emerald-100 bg-emerald-50/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                  <ArrowUpRight className="w-3 h-3" />
                  {currentMarketInfo.todaysChangePct}%
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-slate-500 font-medium mb-1">Current Price</div>
                <div className="text-3xl font-bold text-slate-900">{formatCurrency(currentMarketInfo.currentPrice)}<span className="text-lg text-slate-400 font-medium">/t</span></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-slate-500 font-medium mb-1">Today's Range</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-slate-800">{formatCurrency(currentMarketInfo.todaysLow)}</div>
                  <div className="text-slate-400">-</div>
                  <div className="text-2xl font-bold text-slate-800">{formatCurrency(currentMarketInfo.todaysHigh)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <LineChartIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-slate-500 font-medium mb-1">Market Status</div>
                <div className="text-2xl font-bold text-slate-900">{currentMarketInfo.marketStatus}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-slate-500 font-medium mb-1">Last Updated</div>
                <div className="text-xl font-bold text-slate-900">Just now</div>
                <div className="text-xs text-slate-400 mt-1">Live market feed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left Column: Chart & AI Recommendation */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* AI Recommendation */}
          <Card className="border-amber-200 bg-amber-50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h2 className="font-bold text-amber-900 tracking-tight">AI Market Recommendation</h2>
                  </div>
                  <p className="text-amber-800/80 text-sm leading-relaxed">
                    {aiRecommendation.explanation}
                  </p>
                </div>
                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-amber-100 text-center shrink-0">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Suggested Action</div>
                  <div className="text-2xl font-black text-slate-900 mb-2">{aiRecommendation.action}</div>
                  <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">
                    {aiRecommendation.confidence}% Confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Chart */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Price History</CardTitle>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['1W', '1M', '3M', '6M', '1Y'] as TimeRange[]).map(tr => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      timeRange === tr 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth()+1}/${d.getDate()}`;
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Revenue, Trends, Local */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Expected Revenue */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-6">
              <h3 className="text-slate-400 font-medium text-sm mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Expected Revenue Calculator
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Est. Yield</span>
                  <span className="font-bold">{currentMarketInfo.expectedYield} t/ha</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Revenue Today</span>
                  <span className="font-bold text-lg">{formatCurrency(revenueToday)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">If Sold Next Week</span>
                  <span className="font-bold text-lg text-emerald-400">{formatCurrency(revenueNextWeek)}</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg text-center text-sm font-bold ${revenueDiff > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {revenueDiff > 0 ? '+' : ''}{formatCurrency(revenueDiff)} per hectare difference
              </div>
            </CardContent>
          </Card>

          {/* Nearby Markets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Nearby Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyMarkets.map(market => (
                  <div key={market.id} className="flex items-center justify-between group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-emerald-50 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{market.name}</div>
                        <div className="text-xs text-slate-500">{market.distance} km away</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">{formatCurrency(market.currentPrice)}</div>
                      <div className="flex justify-end mt-0.5">
                        {market.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                        {market.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        {market.trend === 'stable' && <ArrowRight className="w-3 h-3 text-slate-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Indicators */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Trend Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Weekly Trend</div>
                  <div className="text-sm font-bold text-slate-800">{marketTrends.weekly}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Monthly Trend</div>
                  <div className="text-sm font-bold text-slate-800">{marketTrends.monthly}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Demand</div>
                  <div className="text-sm font-bold text-emerald-600">{marketTrends.demand}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Volatility</div>
                  <div className="text-sm font-bold text-slate-800">{marketTrends.volatility}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <CardContent className="p-5 flex items-center justify-center gap-2 text-slate-500 group-hover:text-primary">
              <Bell className="w-4 h-4" />
              <span className="font-medium text-sm">Create Price Alert</span>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
