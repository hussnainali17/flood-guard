import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { CloudRain, Droplets, Calendar, TrendingUp, Info } from 'lucide-react';

export default function RainfallAnalytics({ rainfallRecords, cities }) {
  const [selectedCity, setSelectedCity] = useState('Karachi');

  // Format rainfall records for chart
  const formattedData = rainfallRecords.map(r => {
    const dStr = String(r.date);
    const day = dStr.slice(6, 8);
    const month = "Aug";
    return {
      date: `${month} ${day}`,
      Karachi: r.Karachi || 0,
      Hyderabad: r.Hyderabad || 0,
      Sukkur: r.Sukkur || 0,
      Larkana: r.Larkana || 0,
      Nawabshah: r.Nawabshah || 0,
      Mirpurkhas: r.Mirpurkhas || 0,
      Jacobabad: r.Jacobabad || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Precipitation & Hydrological Analysis
            </h2>
            <p className="text-xs text-slate-400">
              NASA GPM IMERG 30-min satellite rainfall hyetographs during the historic August 2022 flood wave.
            </p>
          </div>
        </div>

        {/* City Filter Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Highlight City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-ocean-900 border border-white/10 text-xs text-cyan-300 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas', 'Jacobabad'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Hyetograph Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200">
              August 2022 Daily Peak Rainfall Hyetograph (mm/hr) — {selectedCity} vs Major Cities
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-ocean-950 px-2 py-0.5 rounded border border-white/5">
            Flood Threshold: 5.0 mm/hr
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="selectedCityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="otherCityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.5rem',
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Threshold Reference Line */}
              <Line 
                type="monotone" 
                dataKey={() => 5.0} 
                stroke="#f43f5e" 
                strokeDasharray="5 5" 
                name="Flood Trigger (5mm/hr)" 
                dot={false}
              />

              <Area 
                type="monotone" 
                dataKey={selectedCity} 
                stroke="#06b6d4" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#selectedCityGrad)" 
                name={`${selectedCity} (Selected)`}
              />

              <Area 
                type="monotone" 
                dataKey="Karachi" 
                stroke="#60a5fa" 
                strokeWidth={1.5}
                fillOpacity={0.2} 
                fill="url(#otherCityGrad)" 
                name="Karachi"
              />

              <Area 
                type="monotone" 
                dataKey="Jacobabad" 
                stroke="#f59e0b" 
                strokeWidth={1.5}
                fillOpacity={0.2} 
                fill="url(#otherCityGrad)" 
                name="Jacobabad"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h4 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Why IMERG vs Rain Gauges?</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sindh lacks a dense telemetry rain gauge network outside Karachi airport. NASA GPM IMERG delivers continuous 30-min spatial coverage across all 98 urban cells, capturing convective cloudbursts across upper and lower Sindh equally.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h4 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>5 mm/hr Calibration Factor</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Satellite precipitation algorithms underestimate extreme localized urban cloudbursts by ~2.5x. A 5 mm/hr IMERG observation corresponds to approximately 15 mm/hr on-the-ground rainfall—the empirical failure threshold of Karachi storm drains.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h4 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Multi-day Soil Saturation</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Feature importance analyses prove that <span className="text-emerald-400 font-semibold">rolling_7day_mm</span> is the #1 predictor of sustained urban inundation, as prolonged antecedent rain saturates clay soils and causes municipal stormwater networks to back up.
          </p>
        </div>
      </div>
    </div>
  );
}
