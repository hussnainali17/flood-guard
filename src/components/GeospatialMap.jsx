import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Droplets, 
  Mountain, 
  Gauge, 
  Sliders, 
  Hospital, 
  ShieldAlert, 
  CheckCircle2, 
  Crosshair,
  Search
} from 'lucide-react';

// Fix Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically re-center map
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 9, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Sample critical infrastructure for Sindh cities
const CRITICAL_INFRASTRUCTURE = [
  { name: "Civil Hospital Karachi", type: "Hospital", lat: 24.8584, lon: 67.0099, city: "Karachi" },
  { name: "Jinnah Postgraduate Medical Centre", type: "Hospital", lat: 24.8519, lon: 67.0504, city: "Karachi" },
  { name: "Liaquat University Hospital", type: "Hospital", lat: 25.3969, lon: 68.3718, city: "Hyderabad" },
  { name: "Civil Hospital Sukkur", type: "Hospital", lat: 27.7052, lon: 68.8574, city: "Sukkur" },
  { name: "Chandka Medical College Hospital", type: "Hospital", lat: 27.5598, lon: 68.2045, city: "Larkana" },
  { name: "Civil Hospital Dadu", type: "Hospital", lat: 26.7329, lon: 67.7767, city: "Dadu" },
  { name: "Jacobabad Institute of Medical Sciences", type: "Hospital", lat: 28.2835, lon: 68.4388, city: "Jacobabad" },
  { name: "Civil Hospital Mirpurkhas", type: "Hospital", lat: 25.5276, lon: 69.0125, city: "Mirpurkhas" },
];

export default function GeospatialMap({ 
  cells, 
  cities, 
  selectedCity, 
  onSelectCity, 
  onSimulateWithFeatures 
}) {
  const [mapCenter, setMapCenter] = useState([26.0, 68.5]);
  const [mapZoom, setMapZoom] = useState(7);
  const [showCells, setShowCells] = useState(true);
  const [showCities, setShowCities] = useState(true);
  const [showInfra, setShowInfra] = useState(false);
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // When selectedCity changes externally, fly to it
  useEffect(() => {
    if (selectedCity) {
      const cityData = cities.find(c => c.city.toLowerCase() === selectedCity.toLowerCase());
      if (cityData) {
        setMapCenter([cityData.lat, cityData.lon]);
        setMapZoom(10);
      }
    }
  }, [selectedCity, cities]);

  const getRiskColor = (prob, riskLevel) => {
    if (riskLevel === 'High' || prob >= 0.66) return '#ef4444';
    if (riskLevel === 'Medium' || prob >= 0.33) return '#f59e0b';
    return '#10b981';
  };

  const filteredCells = cells.filter(cell => {
    const prob = cell.flood_probability !== undefined ? cell.flood_probability : 0.2;
    const isHigh = prob >= 0.66;
    const isMed = prob >= 0.33 && prob < 0.66;
    const isLow = prob < 0.33;

    if (filterRisk === 'HIGH' && !isHigh) return false;
    if (filterRisk === 'MEDIUM' && !isMed) return false;
    if (filterRisk === 'LOW' && !isLow) return false;

    if (searchQuery) {
      return cell.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cell.cell_id?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      {/* Top Map Control Bar */}
      <div className="p-3.5 bg-ocean-900/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">Geospatial Risk Layer:</span>
          </div>

          <div className="flex items-center space-x-1 bg-ocean-950/80 p-1 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                filterRisk === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              All ({cells.length})
            </button>
            <button
              onClick={() => setFilterRisk('HIGH')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                filterRisk === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'
              }`}
            >
              🔴 High Risk
            </button>
            <button
              onClick={() => setFilterRisk('MEDIUM')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                filterRisk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              🟡 Medium
            </button>
            <button
              onClick={() => setFilterRisk('LOW')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                filterRisk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              🟢 Low
            </button>
          </div>
        </div>

        {/* Search & Toggles */}
        <div className="flex items-center space-x-2">
          {/* City / Cell Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search city or cell..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-ocean-950/90 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-36 sm:w-48"
            />
          </div>

          {/* Quick city jump */}
          <select
            value={selectedCity || ''}
            onChange={(e) => {
              if (e.target.value) onSelectCity(e.target.value);
            }}
            className="bg-ocean-950/90 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="">Jump to City...</option>
            {cities.map(c => (
              <option key={c.city} value={c.city}>
                {c.city} ({c.risk_level})
              </option>
            ))}
          </select>

          {/* Infrastructure overlay toggle */}
          <button
            onClick={() => setShowInfra(!showInfra)}
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-all ${
              showInfra 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                : 'bg-ocean-950/90 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Hospitals & Emergency Centers"
          >
            <Hospital className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hospitals</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map View */}
      <div className="h-[620px] w-full relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <MapRecenter center={mapCenter} zoom={mapZoom} />

          {/* Base Tile Layers Switcher */}
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Dark Oceanic (Cyber)">
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite Imagery">
              <TileLayer
                attribution='Tiles &copy; Esri'
                url="https://server.arcgisonline.com/ArcMap/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Render 98 Urban Grid Cells (0.1° / ~10km buffers) */}
          {showCells && filteredCells.map((cell, idx) => {
            const prob = cell.flood_probability !== undefined ? cell.flood_probability : 0.25;
            const riskLevel = cell.predicted_label === 1 || prob >= 0.5 ? (prob >= 0.66 ? 'High' : 'Medium') : 'Low';
            const color = getRiskColor(prob, riskLevel);

            return (
              <Circle
                key={cell.cell_id || `cell-${idx}`}
                center={[cell.lat, cell.lon]}
                radius={5200} // ~0.1° resolution buffer
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: prob >= 0.66 ? 0.45 : 0.25,
                  weight: prob >= 0.66 ? 2.5 : 1.5,
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px]">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span>{cell.city}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {cell.cell_id || `Cell-${idx+1}`} ({cell.lat.toFixed(2)}°N, {cell.lon.toFixed(2)}°E)
                        </span>
                      </div>
                      <span 
                        className="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
                        style={{ color: color, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
                      >
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2.5 text-[11px]">
                      <div className="bg-ocean-900/80 p-1.5 rounded">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Mountain className="w-3 h-3 text-cyan-400" /> Elevation
                        </span>
                        <span className="font-mono text-white font-semibold">
                          {Math.round(cell.elevation_m || 20)}m
                        </span>
                      </div>

                      <div className="bg-ocean-900/80 p-1.5 rounded">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-400" /> Peak Rain
                        </span>
                        <span className="font-mono text-white font-semibold">
                          {(cell.peak_mmhr || 0).toFixed(1)} mm/hr
                        </span>
                      </div>

                      <div className="bg-ocean-900/80 p-1.5 rounded">
                        <span className="text-slate-400">Slope:</span>
                        <span className="font-mono text-white font-semibold ml-1">
                          {(cell.slope_deg || 1.5).toFixed(1)}°
                        </span>
                      </div>

                      <div className="bg-ocean-900/80 p-1.5 rounded">
                        <span className="text-slate-400">7-Day Rain:</span>
                        <span className="font-mono text-white font-semibold ml-1">
                          {Math.round(cell.rolling_7day_mm || 0)} mm
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSimulateWithFeatures && onSimulateWithFeatures({
                        city: cell.city,
                        peak_mmhr: cell.peak_mmhr || 10.0,
                        daily_total_mm: cell.daily_total_mm || 30.0,
                        rolling_3day_mm: cell.rolling_3day_mm || 60.0,
                        rolling_7day_mm: cell.rolling_7day_mm || 120.0,
                        p95_exceedance: cell.p95_exceedance || 0,
                        elevation_m: cell.elevation_m || 20.0,
                        elevation_std: cell.elevation_std || 5.0,
                        slope_deg: cell.slope_deg || 1.5
                      })}
                      className="w-full mt-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Test In AI Risk Sandbox</span>
                    </button>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Render 14 City Center Hub Markers */}
          {showCities && cities.map(city => {
            const color = city.risk_level === 'High' ? '#ef4444' : (city.risk_level === 'Medium' ? '#f59e0b' : '#10b981');
            return (
              <Circle
                key={`city-hub-${city.city}`}
                center={[city.lat, city.lon]}
                radius={12000}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.12,
                  dashArray: '4, 8',
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <h3 className="font-bold text-sm text-white">{city.city} District</h3>
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ color: color, backgroundColor: `${color}20` }}
                      >
                        {city.risk_level} Risk
                      </span>
                    </div>

                    <div className="space-y-1.5 my-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mean Flood Probability:</span>
                        <span className="font-mono font-bold text-white">{(city.avg_prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Inundated Urban Cells:</span>
                        <span className="font-mono text-cyan-400">{city.flood_cells}/{city.total_cells} ({city.flood_pct}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Peak Rainfall:</span>
                        <span className="font-mono text-white">{city.peak_mmhr.toFixed(1)} mm/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">7-Day Cumulative:</span>
                        <span className="font-mono text-white">{city.rolling_7day.toFixed(1)} mm</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCity(city.city)}
                      className="w-full bg-ocean-700 hover:bg-ocean-600 text-cyan-300 text-xs py-1.5 rounded-lg border border-cyan-500/30 transition-all font-medium"
                    >
                      View City Full Profile
                    </button>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Infrastructure Layer (Hospitals & Emergency shelters) */}
          {showInfra && CRITICAL_INFRASTRUCTURE.map((item, idx) => (
            <Marker key={idx} position={[item.lat, item.lon]}>
              <Popup>
                <div className="p-1">
                  <div className="flex items-center space-x-1.5 text-purple-400 font-bold text-xs">
                    <Hospital className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">
                    Emergency Facility • {item.city} District
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend Box */}
        <div className="absolute bottom-4 left-4 z-[400] glass-panel p-3 rounded-xl border border-white/10 text-xs shadow-2xl backdrop-blur-md max-w-[200px]">
          <h5 className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-2">
            Flood Risk Legend
          </h5>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="text-slate-300">High Risk (&ge;66%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-slate-300">Moderate Risk (33-65%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">Low Risk (&lt;33%)</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] text-slate-400">
            Resolution: 0.1° (~10km) GPM IMERG grid cells
          </div>
        </div>
      </div>
    </div>
  );
}
