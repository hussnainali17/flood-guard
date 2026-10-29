import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import AlertBanner from './components/AlertBanner';
import GeospatialMap from './components/GeospatialMap';
import PredictionSandbox from './components/PredictionSandbox';
import RainfallAnalytics from './components/RainfallAnalytics';
import ModelBenchmarks from './components/ModelBenchmarks';
import UnosatValidation from './components/UnosatValidation';
import CityDetailModal from './components/CityDetailModal';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedDate, setSelectedDate] = useState('20220830');
  const [selectedCity, setSelectedCity] = useState(null);
  const [modalCity, setModalCity] = useState(null);
  const [simulatorFeatures, setSimulatorFeatures] = useState(null);

  const [overview, setOverview] = useState(null);
  const [cities, setCities] = useState([]);
  const [cells, setCells] = useState([]);
  const [rainfallRecords, setRainfallRecords] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [ov, c, r, b] = await Promise.all([
          api.getOverview(),
          api.getCities(),
          api.getRainfallSignal(),
          api.getBenchmarks()
        ]);
        setOverview(ov);
        setCities(c || []);
        setRainfallRecords(r || []);
        setBenchmarks(b || []);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // When date changes, update cell predictions
  useEffect(() => {
    async function loadDateCells() {
      try {
        const cellData = await api.getCells(selectedDate);
        setCells(cellData || []);
      } catch (err) {
        console.error("Cell load error:", err);
      }
    }
    loadDateCells();
  }, [selectedDate]);

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    const found = cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setModalCity(found);
    }
  };

  const handleSimulateCity = (cityObj) => {
    setSimulatorFeatures({
      city: cityObj.city,
      peak_mmhr: cityObj.peak_mmhr || 15.0,
      daily_total_mm: (cityObj.peak_mmhr || 15.0) * 3.5,
      rolling_3day_mm: (cityObj.rolling_7day || 50.0) * 0.6,
      rolling_7day_mm: cityObj.rolling_7day || 80.0,
      p95_exceedance: cityObj.peak_mmhr > 5.0 ? 1 : 0,
      elevation_m: cityObj.elevation || 20.0,
      elevation_std: 6.5,
      slope_deg: 1.8
    });
    setActiveTab('simulator');
  };

  const handleSimulateWithFeatures = (features) => {
    setSimulatorFeatures(features);
    setActiveTab('simulator');
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-950 flex flex-col items-center justify-center text-cyan-400 space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Loading FloodGuard Early Warning System...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ocean-950 text-slate-100">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onPrintReport={handlePrintReport}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top High-level Metric Indicators */}
        <StatsBar overview={overview} cities={cities} />

        {/* Emergency Alert Ticker */}
        <AlertBanner cities={cities} onSelectCity={handleSelectCity} />

        {/* Tab Views */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <GeospatialMap 
              cells={cells} 
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              onSimulateWithFeatures={handleSimulateWithFeatures}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <PredictionSandbox 
            initialFeatures={simulatorFeatures}
            onClearInitialFeatures={() => setSimulatorFeatures(null)}
          />
        )}

        {activeTab === 'rainfall' && (
          <RainfallAnalytics 
            rainfallRecords={rainfallRecords}
            cities={cities}
          />
        )}

        {activeTab === 'benchmarks' && (
          <ModelBenchmarks 
            benchmarks={benchmarks}
          />
        )}

        {activeTab === 'unosat' && (
          <UnosatValidation />
        )}
      </main>

      {/* City Drill-Down Modal */}
      {modalCity && (
        <CityDetailModal 
          city={modalCity}
          onClose={() => setModalCity(null)}
          onSimulateCity={handleSimulateCity}
        />
      )}

      {/* Footer with Academic Credits */}
      <Footer />
    </div>
  );
}
