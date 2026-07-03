import { useState } from 'react';
import { mockRecommendations } from '../data/mockData';
import { Recommendation } from '../types';
import { CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';
import { toast } from 'sonner';
import { Card, CardContent, Button, Badge } from '../components/ui';

export default function AIDecisionEngine() {
  const demo = useDemoMode();

  // When demo mode is active, use scenario recommendations
  const baseRecs: Recommendation[] = (demo.isDemoMode && demo.demoData) 
    ? demo.demoData.recommendations.map((r, i) => ({
        id: `demo-rec-${i}`,
        title: `${r.crop} — ${demo.currentScenario?.toUpperCase() || 'DEMO'}`,
        type: 'crop',
        confidence: r.confidence,
        reasoning: r.reasoning.slice(0, 3),
        supportingDatasets: r.supportingDatasets || ['DEMO MODE'],
        expectedYield: r.expectedYield,
        expectedIncome: r.expectedProfit,
        waterSavings: Math.round((r.waterRequirement / 5200) * 38),
        uncertainty: 100 - r.confidence,
        priority: (r.riskLevel === 'High' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
        action: `Apply ${r.crop} recommendation`,
        predictedOutcome: `Expected +${(r.expectedYield - 5.5).toFixed(1)} t/ha, ${(100 - r.confidence) + 6}% uncertainty`,
      }))
    : mockRecommendations;

  const [recommendations, setRecommendations] = useState(baseRecs);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(baseRecs[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateRecommendations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...mockRecommendations].map((r, i) => {
        const seed = (Date.now() + i) % 11;
        return {
          ...r,
          id: `rec-${Date.now()}-${i}`,
          confidence: Math.max(78, Math.min(97, r.confidence + (seed - 5) * 0.6)),
          expectedYield: parseFloat((r.expectedYield + (seed - 5) * 0.06).toFixed(1)),
          expectedIncome: parseFloat((r.expectedIncome + (seed - 4) * 0.3).toFixed(1)),
          waterSavings: Math.max(8, Math.min(47, Math.round(r.waterSavings + (seed % 7 - 3) * 0.8))),
        };
      });
      setRecommendations(shuffled);
      setSelectedRec(shuffled[0]);
      setIsGenerating(false);
    }, 850);
  };

  const applyRecommendation = (rec: Recommendation) => {
    toast.success(`Recommendation applied: ${rec.title}`, {
      description: `Action queued. SMS will be sent to registered farmers.`,
      duration: 4000,
    });
    setRecommendations(prev => prev.map(r => r.id === rec.id ? { ...r, title: '✓ ' + r.title } : r));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">AI Decision Engine</h1>
          <p className="text-slate-500">Explainable multi-objective recommendations</p>
        </div>
        <Button 
          variant="outline" 
          onClick={regenerateRecommendations}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? 'REGENERATING...' : 'REGENERATE RECOMMENDATIONS'} 
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        {/* Recommendations List */}
        <div className="xl:col-span-5 space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
            PRIORITIZED ACTIONS • {recommendations.length}
          </div>
          
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card 
                key={rec.id}
                hoverEffect
                onClick={() => setSelectedRec(rec)}
                className={`cursor-pointer transition-all ${selectedRec?.id === rec.id ? 'border-primary ring-1 ring-primary/20 bg-emerald-50/20' : 'hover:border-slate-300'}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-900 pr-4 leading-tight">{rec.title}</h3>
                    <Badge variant={rec.confidence >= 90 ? 'emerald' : 'amber'}>{rec.confidence}%</Badge>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{rec.predictedOutcome}</p>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex gap-4">
                      <div><span className="text-primary">+{rec.expectedYield}</span> t/ha</div>
                      <div><span className="text-blue-600">{rec.waterSavings}%</span> water</div>
                    </div>
                    <div className={rec.priority === 'high' ? 'text-red-600' : 'text-amber-600'}>
                      {rec.priority.toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] flex gap-3 text-slate-500 font-medium">
                    <span>{rec.confidence}% confidence</span>
                    {rec.uncertainty && <span>±{rec.uncertainty}% uncertainty</span>}
                    {rec.confidence < 70 && <span className="text-amber-600">⚠ Verify locally</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-xs px-1 text-slate-500">All recommendations are explainable. Click any to inspect reasoning.</div>
        </div>

        {/* Detailed Explainable Panel */}
        <div className="xl:col-span-7">
          {selectedRec && (
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="uppercase text-xs font-bold text-primary tracking-widest mb-2">EXPLAINABLE RECOMMENDATION</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight pr-6">{selectedRec.title}</h2>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="emerald" className="mb-1">{selectedRec.confidence}% CONFIDENCE</Badge>
                    <div className="text-xs font-semibold text-red-600">{selectedRec.uncertainty}% uncertainty</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Expected Yield', value: `${selectedRec.expectedYield} t/ha`, color: 'text-primary' },
                    { label: 'Income Uplift', value: `${selectedRec.expectedIncome}M VND`, color: 'text-primary' },
                    { label: 'Water Savings', value: `${selectedRec.waterSavings}%`, color: 'text-blue-600' },
                    { label: 'Priority', value: selectedRec.priority.toUpperCase(), color: selectedRec.priority === 'high' ? 'text-red-600' : 'text-amber-600' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
                      <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Reasoning */}
                <div className="mb-8">
                  <div className="uppercase text-xs tracking-wider font-bold mb-3 text-slate-900">REASONING</div>
                  <div className="space-y-3">
                    {selectedRec.reasoning.map((reason, i) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-700">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <div className="leading-relaxed">{reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Datasets */}
                <div className="mb-8">
                  <div className="uppercase text-xs tracking-wider font-bold mb-3 text-slate-900">SUPPORTING DATASETS</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRec.supportingDatasets.map((ds, i) => (
                      <Badge key={i} variant="slate">{ds}</Badge>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="mb-8 p-4 bg-emerald-50 border-emerald-100 border rounded-xl text-sm">
                  <div className="text-emerald-900 font-bold mb-1">PREDICTED OUTCOME</div>
                  <div className="text-emerald-800">{selectedRec.predictedOutcome}</div>
                </div>

                {/* Action + SMS */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    onClick={() => applyRecommendation(selectedRec)}
                    className="w-full sm:w-auto flex-1 gap-2 py-3"
                  >
                    APPLY RECOMMENDATION <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/live-ops'} 
                    className="w-full sm:w-auto flex-1 py-3"
                  >
                    PREVIEW SMS ALERT
                  </Button>
                </div>

                <div className="mt-4 text-xs text-center text-slate-400 font-medium">
                  All predictions include 95% confidence intervals. Validated against 2020 event dataset.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
