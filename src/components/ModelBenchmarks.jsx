import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  Cell
} from 'recharts';
import { Award, CheckCircle, BarChart3, Database, ShieldCheck, Cpu } from 'lucide-react';

export default function ModelBenchmarks({ benchmarks }) {
  // Top models data for the chart
  const topModelsChart = benchmarks.slice(0, 8).map(m => ({
    name: m.Model.replace(' Classifier', '').replace(' Machine', ''),
    F1: Math.round(m.F1 * 1000) / 10,
    AUC: Math.round(m.AUC * 1000) / 10,
    Accuracy: Math.round(m.Accuracy * 1000) / 10
  }));

  const featureImportances = [
    { feature: "p95_exceedance", importance: 28.5, description: "Exceeded cell 95th percentile historical rain" },
    { feature: "rolling_7day_mm", importance: 23.4, description: "7-day cumulative rainfall (antecedent saturation)" },
    { feature: "elevation_m", importance: 16.2, description: "Mean cell elevation from Copernicus DEM" },
    { feature: "rolling_3day_mm", importance: 12.8, description: "3-day cumulative rainfall buildup" },
    { feature: "peak_mmhr", importance: 9.1, description: "Maximum 30-min rainfall intensity per day" },
    { feature: "slope_deg", importance: 4.8, description: "Mean terrain slope in degrees" },
    { feature: "elevation_std", importance: 3.2, description: "Terrain roughness standard deviation" },
    { feature: "daily_total_mm", importance: 2.0, description: "Total 24-hr daily rainfall volume" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Machine Learning Benchmarks & Validation
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous PyCaret AutoML 15-model cross-validation and temporal holdout evaluation on the historic 2022 Pakistan floods.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            Best Model: LightGBM
          </span>
        </div>
      </div>

      {/* 2022 Unseen Holdout Evaluation Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 font-medium">Test F1 Score (2022)</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">82.7%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+16.7% over baseline</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 font-medium">Test AUC-ROC</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">89.2%</div>
          <span className="text-[10px] text-slate-400">High discrimination power</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 font-medium">Test Accuracy</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">80.4%</div>
          <span className="text-[10px] text-slate-400">9,016 holdout samples</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 font-medium">Training Samples</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">36,064</div>
          <span className="text-[10px] text-slate-400">2015, 2018, 2020 monsoons</span>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Classifier Performance Comparison (%) — Top Models Ranked by F1 Score</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            5-Fold Stratified Cross-Validation
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topModelsChart} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[40, 90]} unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.5rem',
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="F1" fill="#06b6d4" name="F1 Score (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="AUC" fill="#3b82f6" name="AUC-ROC (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Accuracy" fill="#10b981" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance & Confusion Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>LightGBM Feature Importance (SHAP / Gain Ranking)</span>
          </h3>

          <div className="space-y-3 pt-2">
            {featureImportances.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-cyan-300 font-semibold">{item.feature}</span>
                  <span className="font-mono text-slate-300 font-bold">{item.importance}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ocean-950 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.importance * 3.2}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Temporal Holdout & Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2022 Holdout Confusion Matrix</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center my-4 font-mono">
            <div className="bg-ocean-900/80 p-4 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block uppercase">True Negative (TN)</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">3,027</span>
              <span className="text-[10px] text-slate-500">Correctly Non-flood</span>
            </div>

            <div className="bg-ocean-900/80 p-4 rounded-xl border border-rose-500/20">
              <span className="text-[10px] text-slate-400 block uppercase">False Positive (FP)</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">795</span>
              <span className="text-[10px] text-slate-500">False Alarm</span>
            </div>

            <div className="bg-ocean-900/80 p-4 rounded-xl border border-rose-500/20">
              <span className="text-[10px] text-slate-400 block uppercase">False Negative (FN)</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">973</span>
              <span className="text-[10px] text-slate-500">Missed Flood</span>
            </div>

            <div className="bg-ocean-900/80 p-4 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block uppercase">True Positive (TP)</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">4,221</span>
              <span className="text-[10px] text-slate-500">Correctly Predicted Flood</span>
            </div>
          </div>

          <div className="bg-ocean-900/60 p-3.5 rounded-xl border border-white/5 text-xs text-slate-400 space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Temporal Splitting Strategy
            </span>
            <p className="leading-relaxed">
              To eliminate <span className="text-cyan-300 font-semibold">data leakage</span>, entire monsoon seasons were separated. The model was trained on 2015, 2018, and 2020 data and strictly evaluated on the unseen catastrophic 2022 year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
