import React from 'react';
import { Shield, BookOpen, GraduationCap, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-ocean-700/60 bg-ocean-950/80 backdrop-blur-md py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/5">
          {/* Col 1: System info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">FloodSight AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                FYP-2 • 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              An AI-Driven Urban Flood Early Warning and Risk Mapping System for Sindh, Pakistan. Monitored across 98 urban grid cells using NASA GPM IMERG and ESA Copernicus DEM features.
            </p>
          </div>

          {/* Col 2: Authors & Supervision */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              Dawood University of Engineering and Technology
            </span>
            <ul className="text-[11px] space-y-1 text-slate-400">
              <li><b className="text-slate-300">Developers:</b> Serena Khan & Muhammad Muneeb</li>
              <li><b className="text-slate-300">Supervisor:</b> Dr. Asma Sanam Larik, Assistant Professor</li>
              <li>Department of Computer Science, DUET Karachi</li>
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Satellite & Terrain Sources
            </span>
            <p className="text-[11px] text-slate-400">
              NASA GES DISC (GPM IMERG V07B) • ESA Copernicus DEM (30m) • Sentinel-1 SAR GRD • UNOSAT (FL20220808PAK) • WorldPop 2020.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 FloodSight System. Academic Final Year Project (FYP-2).</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 transition-colors">Python 3.11 • LightGBM • React • FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
