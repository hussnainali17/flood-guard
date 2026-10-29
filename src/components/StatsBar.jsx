import React from 'react';
import { ShieldAlert, Award, Compass, Droplets, ArrowUpRight } from 'lucide-react';

export default function StatsBar({ overview, cities }) {
  const highRiskCount = cities.filter(c => c.risk_level === 'High').length;
  const medRiskCount = cities.filter(c => c.risk_level === 'Medium').length;
  const lowRiskCount = cities.filter(c => c.risk_level === 'Low').length;

  const cards = [
    {
      title: "Model Performance",
      mainVal: "82.7% F1",
      subVal: "LightGBM (+16.7% vs baseline)",
      badge: "89.2% AUC-ROC",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: Award,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Active Risk Status",
      mainVal: `${highRiskCount} High Risk`,
      subVal: `${medRiskCount} Moderate • ${lowRiskCount} Normal`,
      badge: "EMERGENCY WATCH",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse",
      icon: ShieldAlert,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Geospatial Scope",
      mainVal: "98 Cells",
      subVal: "14 Sindh Major Urban Centers",
      badge: "0.1° (~10km) Res",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      icon: Compass,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20"
    },
    {
      title: "Rainfall Threshold",
      mainVal: "5.0 mm/hr",
      subVal: "Equivalent to ~15 mm/hr actual",
      badge: "NASA GPM IMERG",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: Droplets,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10 border-sky-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="glass-panel p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h3 className="text-2xl font-bold tracking-tight text-white font-mono">
                    {card.mainVal}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {card.subVal}
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${card.iconBg} ${card.iconColor} shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center">
                Details <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
