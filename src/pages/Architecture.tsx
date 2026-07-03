

export default function Architecture() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-9">
      <div className="mb-9">
        <div className="font-semibold tracking-tight text-4xl">System Architecture</div>
        <div className="text-xl text-slate-500">Production-grade architecture designed for scale</div>
      </div>

      <div className="grid md:grid-cols-2 gap-7">
        {/* Data Ingestion */}
        <div className="card p-7">
          <div className="font-semibold mb-3">Satellite &amp; Ground Data Ingestion</div>
          <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
            <li>Sentinel-1 (SAR) and Sentinel-2 (MSI) — Google Earth Engine API</li>
            <li>CHIRPS rainfall (UCSB Climate Hazards Center)</li>
            <li>NASA MODIS LST &amp; NDVI — daily</li>
            <li>MONRE ground truth stations (10 provincial)</li>
            <li>Real-time ingestion every 15 minutes via GEE + custom ETL</li>
          </ul>
        </div>

        <div className="card p-7">
          <div className="font-semibold mb-3">Preprocessing &amp; Feature Store</div>
          <div className="text-sm leading-relaxed text-slate-600">
            Cloud masking, atmospheric correction, harmonization to 10m resolution. 
            Derived features: NDVI, EVI, salinity index (SAVI), soil moisture anomaly, rainfall anomaly, evapotranspiration.
            All stored in a feature store with temporal versioning.
          </div>
        </div>

        <div className="card p-7">
          <div className="font-semibold mb-3">Machine Learning Layer</div>
          <div className="text-sm">XGBoost + LSTM Ensemble trained on 2016–2025 data.<br />Multi-task prediction: yield, salinity, water stress.<br />Explainability via SHAP + LIME.</div>
          <div className="mt-3 text-xs bg-emerald-100 inline-block px-3 py-1 rounded-full">94.2% out-of-sample accuracy on 2020 test set</div>
        </div>

        <div className="card p-7">
          <div className="font-semibold mb-3">Decision &amp; Recommendation Engine</div>
          <div className="text-sm text-slate-600">Multi-objective optimization (yield vs water vs risk).<br />Rule engine + LLM-assisted explanation generation.<br />Confidence calibrated with uncertainty quantification.</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="font-semibold mb-4">Deployment Architecture</div>
        <div className="bg-white border rounded-3xl p-7 grid md:grid-cols-3 gap-y-7 text-sm">
          <div>
            <div className="font-semibold">Frontend</div>
            <div className="text-xs">Vite + React 18 + TypeScript + Tailwind + Leaflet + Recharts + Framer Motion</div>
          </div>
          <div>
            <div className="font-semibold">Backend &amp; APIs</div>
            <div className="text-xs">FastAPI (Python) • GEE Python API • PostgreSQL/PostGIS • Redis</div>
          </div>
          <div>
            <div className="font-semibold">Infrastructure</div>
            <div className="text-xs">AWS (or Azure VN) • Kubernetes • GEE • Cloud Functions • Twilio / Viettel SMS gateway</div>
          </div>
          <div className="md:col-span-3 text-xs text-emerald-700 mt-2">Designed to support 500k+ concurrent users and 100k ha with sub-minute latency for recommendations.</div>
        </div>
      </div>
    </div>
  );
}
