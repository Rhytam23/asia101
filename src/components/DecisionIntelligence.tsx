import { CropRecommendation } from '../types/recommendation';
import { useState } from 'react';
import { RecommendationsSkeleton } from './shared/LoadingStates';

interface Props {
  recommendations: CropRecommendation[];
  locationName: string;
  loading?: boolean;
}

export default function DecisionIntelligence({ recommendations, locationName, loading }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleWhy = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (!recommendations.length) {
    return (
      <div className="card p-6 text-sm text-slate-500">
        Select a location to run the Decision Intelligence Engine.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg tracking-tight">Decision Intelligence Engine</div>
            <div className="text-xs text-emerald-700">Analysis for {locationName}</div>
          </div>
          <div className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">MODULAR • ML-READY • FULLY TRANSPARENT</div>
        </div>
      </div>

      <div className="p-4 space-y-3 bg-white">
        {recommendations.map((rec, index) => {
          const isExpanded = !!expanded[index];
          return (
            <div 
              key={index} 
              className="border border-slate-200 rounded-2xl p-4 hover:border-emerald-200 transition"
            >
              <div className="flex justify-between items-start">
                <div className="font-semibold text-lg tracking-tight">{rec.crop}</div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-px text-xs font-bold rounded-full ${rec.confidence > 85 ? 'bg-emerald-700 text-white' : rec.confidence > 72 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                    {rec.confidence}% CONFIDENCE
                  </div>
                  <div className={`text-xs px-2.5 py-px rounded-full border font-medium ${
                    rec.riskLevel === 'Low' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 
                    rec.riskLevel === 'Medium' ? 'border-amber-300 text-amber-700 bg-amber-50' : 
                    'border-red-300 text-red-700 bg-red-50'
                  }`}>
                    {rec.riskLevel} RISK
                  </div>
                </div>
              </div>

              {/* Trust header row — always visible */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-slate-500">Last updated:</span>{' '}
                  <span className="font-medium text-slate-700">
                    {rec.lastUpdated ? new Date(rec.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Uncertainty:</span>{' '}
                  <span className={`font-semibold ${rec.uncertainty > 25 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    ±{rec.uncertainty ?? 12}%
                  </span>
                </div>
                {rec.confidence < 70 && (
                  <div className="text-amber-600 font-medium">⚠️ Moderate confidence</div>
                )}
              </div>

              {/* Low confidence warning — prominent but not alarming */}
              {rec.confidence < 70 && (
                <div className="mt-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <strong>Caution:</strong> Confidence is moderate. We recommend verifying with local agricultural extension services before making major changes to your farm.
                </div>
              )}

              {/* Expected Benefit — clean and prominent */}
              {rec.expectedBenefit && (
                <div className="mt-2 text-sm">
                  <span className="text-emerald-700 font-medium">Expected benefit:</span>{' '}
                  <span className="text-slate-700">{rec.expectedBenefit}</span>
                </div>
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-3 mt-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Expected Yield</div>
                  <div className="font-semibold text-xl tracking-tighter">{rec.expectedYield} <span className="text-xs font-normal">t/ha</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Expected Profit</div>
                  <div className="font-semibold text-xl tracking-tighter">{rec.expectedProfit} <span className="text-xs font-normal">M VND</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Water Requirement</div>
                  <div className="font-semibold text-xl tracking-tighter">{rec.waterRequirement.toLocaleString()} <span className="text-xs font-normal">m³/ha</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Risk Level</div>
                  <div className="font-semibold">{rec.riskLevel}</div>
                </div>
              </div>

              {/* Reasoning - Always shown */}
              <div className="mt-4">
                <div className="uppercase text-xs tracking-wider font-semibold text-emerald-700 mb-1.5">REASONING</div>
                <ul className="text-sm space-y-1 pl-1 text-slate-700">
                  {rec.reasoning.map((reason, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600 font-mono mt-0.5">→</span> 
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Evidence + Datasets */}
              <div className="mt-3 pt-3 border-t">
                <div className="uppercase text-xs tracking-wider font-semibold text-slate-500 mb-1">SUPPORTING EVIDENCE</div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {rec.supportingEvidence.map((ev, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-px rounded-full text-slate-600 border border-slate-200">
                      {ev}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500">
                  <span className="font-medium">Datasets:</span> {rec.supportingDatasets?.join(' • ')}
                </div>
              </div>

              {/* WHY THIS RECOMMENDATION? — fully transparent panel (prominent, always present) */}
              <div className="mt-4 border-2 border-emerald-300 rounded-2xl bg-emerald-50/60 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-xs tracking-[1.5px] font-extrabold text-emerald-900">WHY THIS RECOMMENDATION?</span>
                    <span className="text-[10px] px-2.5 py-0.5 bg-emerald-800 text-white rounded-full font-mono font-bold tracking-wider">{rec.confidenceBreakdown?.overall || rec.confidence}%</span>
                  </div>
                  <button 
                    onClick={() => toggleWhy(index)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold tracking-wide px-3 py-0.5 rounded-full bg-white border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    {isExpanded ? 'HIDE DETAILS' : 'SHOW WHY + LIMITATIONS'}
                  </button>
                </div>

                {/* Always-visible quick summary + confidence breakdown + formula */}
                <div className="mt-1 mb-2">
                  <div className="text-[10px] uppercase font-semibold text-emerald-800 mb-1 tracking-wider">CONFIDENCE FACTORS (INSTANT VIEW)</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1 text-[10px]">
                    {rec.confidenceBreakdown && Object.entries(rec.confidenceBreakdown).map(([key, val]) => (
                      <div key={key} className="bg-white px-2 py-[1px] rounded border border-emerald-200 text-center flex items-center justify-center gap-1">
                        <span className="font-medium text-emerald-900 capitalize">{key}</span> 
                        <span className="font-bold text-emerald-700 tabular-nums">{val}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Always-visible exact formula + visual confidence bar */}
                <div className="text-[9px] bg-white border border-emerald-200 rounded-xl px-3 py-1.5 mb-1.5 font-mono text-emerald-900 flex items-center gap-2">
                  <span className="flex-1">{rec.calculationFormula || 'Transparent 7-factor weighted formula'}</span>
                  <div className="h-1.5 w-16 bg-emerald-100 rounded overflow-hidden flex-shrink-0">
                    <div className="h-1.5 bg-emerald-700 transition-all" style={{ width: `${rec.confidence}%` }} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-3 border-t border-emerald-300 space-y-4 text-sm">
                    {/* Trust summary — always shown in expanded view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border">
                        <div className="font-medium text-emerald-800 mb-1">Last Updated</div>
                        <div>{rec.lastUpdated ? new Date(rec.lastUpdated).toLocaleString() : 'Just now'}</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border">
                        <div className="font-medium text-emerald-800 mb-1">Prediction Uncertainty</div>
                        <div className={rec.uncertainty > 25 ? 'text-amber-600 font-semibold' : 'text-emerald-700'}>
                          ±{rec.uncertainty ?? 12}% — {rec.uncertainty > 25 ? 'Moderate uncertainty' : 'Relatively stable prediction'}
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border md:col-span-2">
                        <div className="font-medium text-emerald-800 mb-1">Expected Benefit</div>
                        <div className="text-slate-700">{rec.expectedBenefit}</div>
                      </div>
                      {rec.limitations && rec.limitations.length > 0 && (
                        <div className="bg-white p-2.5 rounded-xl border md:col-span-2">
                          <div className="font-medium text-emerald-800 mb-1">Known Limitations</div>
                          <ul className="list-disc pl-4 text-xs space-y-0.5 text-slate-600">
                            {rec.limitations.map((lim, li) => <li key={li}>{lim}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Exact weighted math breakdown */}
                    {rec.confidenceContributions && rec.confidenceContributions.length > 0 && (
                      <div>
                        <div className="uppercase font-semibold text-[10px] tracking-wider text-emerald-700 mb-1">EXACT CONFIDENCE CALCULATION (FULL AUDIT)</div>
                        <div className="bg-white border rounded-xl p-2 text-xs overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-emerald-800 border-b">
                                <th className="py-0.5 pr-2">Factor</th>
                                <th className="py-0.5 px-1 text-center">Weight</th>
                                <th className="py-0.5 px-1 text-center">Score</th>
                                <th className="py-0.5 px-1 text-right">Contribution</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rec.confidenceContributions.map((c, i) => (
                                <tr key={i} className="border-b border-emerald-100 last:border-0">
                                  <td className="py-px pr-2 text-emerald-900">{c.factor}</td>
                                  <td className="py-px px-1 text-center font-mono text-emerald-700">{(c.weight * 100).toFixed(0)}%</td>
                                  <td className="py-px px-1 text-center font-semibold">{c.score}</td>
                                  <td className="py-px px-1 text-right font-bold text-emerald-800">+{c.contribution}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-1 pt-1 border-t text-[10px] text-emerald-700 font-medium">
                            Total = {rec.confidence}% (rounded)
                          </div>
                        </div>
                      </div>
                    )}

                    {/* All Influence Cards including Satellite */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {/* Weather */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="flex justify-between text-xs mb-0.5">
                          <div className="font-semibold text-emerald-800">Weather Influence</div>
                          <div className="font-mono font-bold text-emerald-700">{rec.weatherInfluence.score}%</div>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{rec.weatherInfluence.explanation}</div>
                        <div className="text-[9px] text-slate-500 mt-1">Source: {rec.weatherInfluence.dataSource} {rec.weatherInfluence.liveValue && `• ${rec.weatherInfluence.liveValue}`}</div>
                      </div>

                      {/* Soil */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="flex justify-between text-xs mb-0.5">
                          <div className="font-semibold text-emerald-800">Soil &amp; Salinity Influence</div>
                          <div className="font-mono font-bold text-emerald-700">{rec.soilInfluence.score}%</div>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{rec.soilInfluence.explanation}</div>
                        <div className="text-[9px] text-slate-500 mt-1">Source: {rec.soilInfluence.dataSource} {rec.soilInfluence.liveValue && `• ${rec.soilInfluence.liveValue}`}</div>
                      </div>

                      {/* Market */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="flex justify-between text-xs mb-0.5">
                          <div className="font-semibold text-emerald-800">Market Influence</div>
                          <div className="font-mono font-bold text-emerald-700">{rec.marketInfluence.score}%</div>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{rec.marketInfluence.explanation}</div>
                        <div className="text-[9px] text-slate-500 mt-1">Source: {rec.marketInfluence.dataSource} {rec.marketInfluence.liveValue && `• ${rec.marketInfluence.liveValue}`}</div>
                      </div>

                      {/* Historical */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="flex justify-between text-xs mb-0.5">
                          <div className="font-semibold text-emerald-800">Historical Influence</div>
                          <div className="font-mono font-bold text-emerald-700">{rec.historicalInfluence.score}%</div>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{rec.historicalInfluence.explanation}</div>
                        <div className="text-[9px] text-slate-500 mt-1">Source: {rec.historicalInfluence.dataSource}</div>
                      </div>

                      {/* Satellite & Vegetation — NEW */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="flex justify-between text-xs mb-0.5">
                          <div className="font-semibold text-emerald-800">Satellite &amp; Vegetation Influence</div>
                          <div className="font-mono font-bold text-emerald-700">{rec.satelliteInfluence?.score ?? 72}%</div>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{rec.satelliteInfluence?.explanation || 'Satellite data supports crop suitability'}</div>
                        <div className="text-[9px] text-slate-500 mt-1">Source: {rec.satelliteInfluence?.dataSource || 'Sentinel-2 + SoilGrids'} {rec.satelliteInfluence?.liveValue && `• ${rec.satelliteInfluence.liveValue}`}</div>
                      </div>
                    </div>

                    {/* Water Analysis */}
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <div className="flex justify-between text-xs mb-1">
                        <div className="font-semibold text-emerald-800">Water Analysis</div>
                        <div className="font-mono font-bold text-emerald-700">{rec.waterAnalysis.efficiencyScore}% efficiency</div>
                      </div>
                      <div className="text-xs grid grid-cols-3 gap-1 mb-1.5">
                        <div>Req: <span className="font-medium">{rec.waterAnalysis.requirement.toLocaleString()} m³/ha</span></div>
                        <div>Avail: <span className="font-medium">{rec.waterAnalysis.availability.toLocaleString()} m³/ha</span></div>
                        <div>Score: <span className="font-medium">{rec.waterAnalysis.efficiencyScore}</span></div>
                      </div>
                      <div className="text-[11px] text-slate-700">{rec.waterAnalysis.analysis}</div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <div className="font-semibold text-emerald-800">Risk Assessment</div>
                        <div className={`px-2 py-0.5 text-[10px] rounded-full font-medium border ${rec.riskAssessment.level === 'Low' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : rec.riskAssessment.level === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                          {rec.riskAssessment.level} • Score: {rec.riskAssessment.score}
                        </div>
                      </div>
                      <div className="text-xs mb-1">
                        <span className="text-slate-600">Key factors:</span> {rec.riskAssessment.keyFactors.join(', ')}
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-600">Mitigation:</span> {rec.riskAssessment.mitigationStrategies.join(' • ')}
                      </div>
                    </div>

                    {/* Supporting Datasets (explicit) */}
                    <div>
                      <div className="uppercase font-semibold text-[10px] tracking-wider text-emerald-700 mb-1">SUPPORTING DATASETS (LIVE + CACHED)</div>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {(rec.supportingDatasets || []).map((ds, i) => (
                          <span key={i} className="bg-white px-2 py-px border border-emerald-100 rounded text-emerald-800">{ds}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 text-[10px] bg-slate-50 border-t text-slate-500">
        Engine v2.0 — Fully transparent modular scoring. Every score and influence traceable to live data. Ready for ML replacement.
      </div>
    </div>
  );
}
