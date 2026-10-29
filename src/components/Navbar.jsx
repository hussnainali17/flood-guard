import React from 'react';
import { 
  CloudRain, 
  Satellite, 
  Layers, 
  Sliders, 
  BarChart3, 
  ShieldAlert, 
  CloudLightning, 
  Printer,
  Calendar
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedDate, setSelectedDate, onPrintReport }) {
  const tabs = [
    { id: 'map', label: 'Geospatial Map', icon: Layers },
    { id: 'simulator', label: 'AI Risk Sandbox', icon: Sliders },
    { id: 'rainfall', label: 'Hydrology & Rain', icon: CloudRain },
    { id: 'benchmarks', label: 'Model Benchmarks', icon: BarChart3 },
    { id: 'unosat', label: 'UNOSAT SAR', icon: Satellite },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-ocean-700/60 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/20">
              <CloudLightning className="w-5 h-5 text-white animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-ocean-950 animate-ping-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  FloodGuard
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                  AI v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Sindh Urban Flood Early Warning Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-ocean-900/80 p-1.5 rounded-xl border border-white/5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Demo Date Switcher */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-ocean-900/90 border border-ocean-700/70 px-2.5 py-1 rounded-lg text-xs">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs font-mono font-medium"
              >
                <option value="20220830" className="bg-ocean-900 text-slate-200">Aug 30, 2022 (Peak Crisis)</option>
                <option value="20220816" className="bg-ocean-900 text-slate-200">Aug 16, 2022 (Karachi 53mm/hr)</option>
                <option value="20220822" className="bg-ocean-900 text-slate-200">Aug 22, 2022 (Northern Sindh)</option>
                <option value="20220824" className="bg-ocean-900 text-slate-200">Aug 24, 2022 (Widespread)</option>
              </select>
            </div>

            {/* Print/Export Button */}
            <button
              onClick={onPrintReport}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md shadow-cyan-900/30 transition-all active:scale-95"
              title="Export Crisis Assessment Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Risk Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-white/5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-ocean-900/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
