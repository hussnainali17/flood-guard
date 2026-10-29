import React from 'react';
import { X, MapPin, Droplets, Mountain, Sliders, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export default function CityDetailModal({ city, onClose, onSimulateCity }) {
  if (!city) return null;

  const color = city.risk_level === 'High' ? '#ef4444' : (city.risk_level === 'Medium' ? '#f59e0b' : '#10b981');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-glow w-full max-w-lg rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: color }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* City Title & Badge */}
        <div className="flex items-start space-x-3 mb-4">
          <div 
            className="p-3 rounded-xl border flex items-center justify-center mt-1"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color: color }}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {city.city} District
              </h3>
              <span 
                className="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono uppercase"
                style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}50` }}
              >
                {city.risk_level} Risk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sindh Urban Hydrological Assessment Zone ({city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E)
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="bg-ocean-900/80 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-1">Mean Flood Probability</span>
            <span className="text-2xl font-bold font-mono text-white">
              {(city.avg_prob * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-ocean-900/80 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-1">Inundated Urban Area</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {city.flood_cells} / {city.total_cells} cells ({city.flood_pct}%)
            </span>
          </div>

          <div className="bg-ocean-900/80 p-3 rounded-xl border border-white/5 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Peak Rain</span>
              <span className="font-mono font-bold text-white">{city.peak_mmhr.toFixed(1)} mm/hr</span>
            </div>
          </div>

          <div className="bg-ocean-900/80 p-3 rounded-xl border border-white/5 flex items-center space-x-2">
            <Mountain className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400 block">Elevation (Copernicus DEM)</span>
              <span className="font-mono font-bold text-white">{Math.round(city.elevation)}m</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
          <button
            onClick={() => {
              onSimulateCity(city);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-900/30 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate Risk in AI Sandbox</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-slate-300 border border-white/10 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
