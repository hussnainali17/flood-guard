import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, BellRing, PhoneCall, ShieldCheck } from 'lucide-react';

export default function AlertBanner({ cities, onSelectCity }) {
  const [expanded, setExpanded] = useState(false);
  const highRisk = cities.filter(c => c.risk_level === 'High');

  if (highRisk.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/80 via-ocean-900/90 to-ocean-950/90 p-4 shadow-xl shadow-rose-950/20 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 animate-pulse">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white">
                EMERGENCY ALERT
              </span>
              <span className="text-sm font-semibold text-rose-200">
                {highRisk.length} Major Urban Centers In Inundation Escalation Phase
              </span>
            </div>
            <p className="text-xs text-rose-300/80 mt-0.5">
              High flood probabilities detected in <span className="font-semibold text-white">{highRisk.map(c => c.city).join(', ')}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <div className="flex flex-wrap gap-1.5">
            {highRisk.map(c => (
              <button
                key={c.city}
                onClick={() => onSelectCity(c.city)}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-colors font-medium"
              >
                {c.city} ({Math.round(c.avg_prob * 100)}%)
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Toggle Civil Defense Action Checklist"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-ocean-900/60 p-3 rounded-lg border border-white/5">
            <div className="flex items-center space-x-2 text-rose-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Hydraulic De-watering Priority</span>
            </div>
            <p className="text-slate-400">
              Station municipal heavy suction pumps at primary arterial underpasses, low-lying storm canal bottlenecks, and transformer substations.
            </p>
          </div>

          <div className="bg-ocean-900/60 p-3 rounded-lg border border-white/5">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Evacuation Corridor Activation</span>
            </div>
            <p className="text-slate-400">
              Designate higher-elevation relief centers (public colleges and district stadiums) above 25m elevation contour. Secure emergency boat routes.
            </p>
          </div>

          <div className="bg-ocean-900/60 p-3 rounded-lg border border-white/5">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>PDMA / NDMA Command Line</span>
            </div>
            <p className="text-slate-400">
              Synchronize GPM IMERG 30-min satellite rain exceedances with district disaster management authorities for rapid relief dispatch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
