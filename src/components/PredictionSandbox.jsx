import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  BarChart2, 
  Layers, 
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

const PRESETS = [
  {
    name: "Karachi Peak Flood (Aug 16, 2022)",
    data: {
      city: "Karachi",
      peak_mmhr: 53.6,
      daily_total_mm: 126.5,
      rolling_3day_mm: 184.0,
      rolling_7day_mm: 248.5,
      p95_exceedance: 1,
      elevation_m: 14.1,
      elevation_std: 10.9,
      slope_deg: 2.9
    }
  },
  {
    name: "Dadu Basin Surge (Catastrophic)",
    data: {
      city: "Dadu",
      peak_mmhr: 38.5,
      daily_total_mm: 98.0,
      rolling_3day_mm: 195.0,
      rolling_7day_mm: 310.0,
      p95_exceedance: 1,
      elevation_m: 24.5,
      elevation_std: 6.2,
      slope_deg: 1.1
    }
  },
  {
    name: "Sukkur Moderate Monsoon",
    data: {
      city: "Sukkur",
      peak_mmhr: 12.0,
      daily_total_mm: 34.0,
      rolling_3day_mm: 52.0,
      rolling_7day_mm: 78.0,
      p95_exceedance: 1,
      elevation_m: 38.0,
      elevation_std: 8.5,
      slope_deg: 1.8
    }
  },
  {
    name: "Hyderabad Normal / Dry Day",
    data: {
      city: "Hyderabad",
      peak_mmhr: 1.2,
      daily_total_mm: 3.5,
      rolling_3day_mm: 8.0,
      rolling_7day_mm: 14.0,
      p95_exceedance: 0,
      elevation_m: 32.0,
      elevation_std: 7.1,
      slope_deg: 1.4
    }
  }
];

export default function PredictionSandbox({ initialFeatures, onClearInitialFeatures }) {
  const [formData, setFormData] = useState(
    initialFeatures || PRESETS[0].data
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    if (initialFeatures) {
      setFormData(initialFeatures);
      runPrediction(initialFeatures);
    } else {
      runPrediction(formData);
    }
  }, [initialFeatures]);

  const runPrediction = async (dataToPredict) => {
    setLoading(true);
    try {
      const res = await api.predict(dataToPredict || formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    runPrediction(updated);
  };

  const loadPreset = (preset) => {
    setFormData(preset.data);
    runPrediction(preset.data);
    setSimulationResult(null);
  };

  const runCitySimulation = async () => {
    setSimLoading(true);
    try {
      const res = await api.simulate(formData.city || "Karachi", 1.8, 15.0);
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Flood Risk Inference Sandbox
              </h2>
              <p className="text-xs text-slate-400">
                Direct inference using trained <span className="text-cyan-400 font-semibold">LightGBM Classifier</span>. Adjust parameters in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-ocean-900 hover:bg-ocean-800 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all font-medium active:scale-95"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls vs Live AI Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Hydrological & Terrain Input Vectors</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
              City: {formData.city || "Karachi"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Peak Rainfall (mm/hr) */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Peak Rainfall (30-min Max)</span>
                <span className="font-mono font-bold text-cyan-400">{formData.peak_mmhr} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={formData.peak_mmhr}
                onChange={(e) => handleSliderChange('peak_mmhr', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm/hr (Dry)</span>
                <span className="text-amber-400 font-medium">5.0 mm/hr (Threshold)</span>
                <span>60 mm/hr</span>
              </div>
            </div>

            {/* 2. 7-Day Cumulative (mm) */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">7-Day Cumulative Rain</span>
                <span className="font-mono font-bold text-cyan-400">{formData.rolling_7day_mm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="350"
                step="2"
                value={formData.rolling_7day_mm}
                onChange={(e) => handleSliderChange('rolling_7day_mm', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span className="text-sky-400 font-medium">Top Predictor</span>
                <span>350 mm</span>
              </div>
            </div>

            {/* 3. 3-Day Cumulative (mm) */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">3-Day Cumulative Rain</span>
                <span className="font-mono font-bold text-cyan-400">{formData.rolling_3day_mm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="2"
                value={formData.rolling_3day_mm}
                onChange={(e) => handleSliderChange('rolling_3day_mm', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>250 mm</span>
              </div>
            </div>

            {/* 4. Total Daily Rainfall (mm) */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Total Daily Rainfall</span>
                <span className="font-mono font-bold text-cyan-400">{formData.daily_total_mm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="1"
                value={formData.daily_total_mm}
                onChange={(e) => handleSliderChange('daily_total_mm', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>180 mm</span>
              </div>
            </div>

            {/* 5. Mean Elevation (Copernicus DEM) */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Elevation (DEM)</span>
                <span className="font-mono font-bold text-cyan-400">{formData.elevation_m} meters</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="1"
                value={formData.elevation_m}
                onChange={(e) => handleSliderChange('elevation_m', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="text-rose-400">5m (Coastal/Lowlands)</span>
                <span>120m</span>
              </div>
            </div>

            {/* 6. Slope in Degrees */}
            <div className="space-y-1.5 bg-ocean-900/60 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Terrain Slope</span>
                <span className="font-mono font-bold text-cyan-400">{formData.slope_deg}°</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={formData.slope_deg}
                onChange={(e) => handleSliderChange('slope_deg', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-ocean-950 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.2° (Flat Basin)</span>
                <span>5.0°</span>
              </div>
            </div>
          </div>

          {/* 7. P95 Exceedance Toggle */}
          <div className="bg-ocean-900/70 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">
                Cell Historical P95 Rainfall Exceedance
              </span>
              <span className="text-xs text-slate-400">
                Did local rainfall surpass the 95th percentile historical extreme threshold?
              </span>
            </div>
            <button
              onClick={() => handleSliderChange('p95_exceedance', formData.p95_exceedance === 1 ? 0 : 1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                formData.p95_exceedance === 1
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-ocean-800 text-slate-400 border border-white/10'
              }`}
            >
              {formData.p95_exceedance === 1 ? 'EXCEEDED (1)' : 'BELOW P95 (0)'}
            </button>
          </div>
        </div>

        {/* Right Column: AI Output & Probability Dial (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Glowing accent border corresponding to risk color */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
              style={{ backgroundColor: result?.alert_color || '#10b981' }}
            />

            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Model Prediction
              </span>
              <span className="text-xs font-mono text-slate-500">
                LightGBM v4.7
              </span>
            </div>

            {/* Probability Gauge Circle */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-ocean-900"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    stroke={result?.alert_color || '#10b981'}
                    strokeWidth="14"
                    strokeDasharray={477}
                    strokeDashoffset={477 - (477 * (result?.flood_probability || 0))}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                    {result ? `${Math.round(result.flood_probability * 100)}%` : '--'}
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                    Flood Probability
                  </span>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="mt-4">
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider font-mono shadow-md inline-block"
                  style={{ 
                    backgroundColor: `${result?.alert_color || '#10b981'}20`, 
                    color: result?.alert_color || '#10b981',
                    border: `1px solid ${result?.alert_color || '#10b981'}50`
                  }}
                >
                  {result?.risk_level || 'Low'} Risk Level
                </span>
              </div>
            </div>

            {/* Action Advisory Box */}
            <div className="bg-ocean-900/80 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Civil Defense Advisory:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result?.action_advisory}
              </p>
            </div>

            {/* What-If City Surge Simulator */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={runCitySimulation}
                disabled={simLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
              >
                {simLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-300" />
                )}
                <span>Simulate 1.8x Monsoon Surge in {formData.city || "Karachi"}</span>
              </button>

              {simulationResult && (
                <div className="mt-3 p-3 rounded-xl bg-ocean-950/80 border border-cyan-500/30 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-semibold">{simulationResult.city} Escalation:</span>
                    <span className={`font-bold font-mono ${simulationResult.simulated_risk === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {simulationResult.original_risk} &rarr; {simulationResult.simulated_risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {simulationResult.recommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
