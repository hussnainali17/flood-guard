import React from 'react';
import { Shield, BookOpen, Activity, Globe, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-ocean-700/60 bg-ocean-950/90 backdrop-blur-md py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/5">
          {/* Col 1: System info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>FloodGuard AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                v2.0 Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              An AI-Driven Urban Flood Early Warning and Risk Intelligence System for Sindh, Pakistan. Continuous real-time geospatial risk escalation across 98 urban grid cells calibrated against NASA GPM IMERG and Copernicus terrain models.
            </p>
          </div>

          {/* Col 2: Operational Monitoring Scope */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Operational Hydrology Network
            </span>
            <ul className="text-[11px] space-y-1 text-slate-400">
              <li><b className="text-slate-300">Coverage:</b> 14 Municipal Urban Districts (Sindh)</li>
              <li><b className="text-slate-300">Grid Resolution:</b> 0.1° (~10km) GPM IMERG Cells</li>
              <li><b className="text-slate-300">Inference Engine:</b> Calibrated LightGBM ML Pipeline</li>
              <li><b className="text-slate-300">Detection Baseline:</b> 5.0 mm/hr Drainage Surge Threshold</li>
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Earth Observation & Terrain Feeds
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              NASA GES DISC (GPM IMERG V07B) • ESA Copernicus DEM (30m) • Sentinel-1 SAR GRD • UNOSAT Satellite Water Extent • WorldPop Global Human Settlement.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 FloodGuard AI. Real-Time Climate & Flood Risk Intelligence Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono">LightGBM • React 18 • FastAPI • High-Availability GIS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
