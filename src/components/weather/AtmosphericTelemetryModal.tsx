import { useState, useEffect } from 'react';
import { fetchLiveGunturRFWeather } from '../../api/weather';
import type { LiveRFWeather } from '../../api/weather';

interface AtmosphericTelemetryModalProps {
  onClose: () => void;
}

export const AtmosphericTelemetryModal = ({ onClose }: AtmosphericTelemetryModalProps) => {
  const [weather, setWeather] = useState<LiveRFWeather | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await fetchLiveGunturRFWeather();
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGunturRFWeather().then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[18px]">cloud</span>
            </span>
            <div>
              <h3 className="font-bold text-sm text-white">Atmospheric RF Propagation &amp; Rain Fade</h3>
              <p className="text-[10px] text-slate-400 font-mono">ITU-R P.676-13 Physical Layer Attenuation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadWeather(true)}
              disabled={loading}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Refresh Live Meteorological Feed"
            >
              <span className={`material-symbols-outlined text-[15px] ${loading ? 'animate-spin text-sky-400' : ''}`}>
                sync
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Weather Station Hero Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-800/80 to-slate-900 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                  Live Open-Meteo Guntur Station
                </span>
              </div>
              <div className="text-xl font-black text-white mt-1">Chowdavaram, Guntur (AP)</div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                16.2551° N, 80.3240° E • Elev: 33m ASL
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-amber-400 font-mono">
                {weather ? `${weather.temperature.toFixed(1)}°C` : '31.2°C'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-400">
                  {weather?.weatherIcon || 'wb_sunny'}
                </span>
                <span>{weather?.weatherDesc || 'Live Meteorological Telemetry'}</span>
              </div>
            </div>
          </div>

          {/* Environmental Sensors Grid */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Relative Humidity</span>
              <span className="text-base font-bold text-sky-400">
                {weather ? `${weather.humidity}%` : '62%'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Barometric Press</span>
              <span className="text-base font-bold text-emerald-400">
                {weather ? `${weather.pressure.toFixed(1)} hPa` : '1011.8 hPa'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Vapor Density</span>
              <span className="text-base font-bold text-indigo-400">
                {weather ? `${weather.vaporDensity} g/m³` : '18.4 g/m³'}
              </span>
            </div>
          </div>

          {/* Rain Fade Risk Status Banner */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-sky-400">water_drop</span>
              <span className="text-slate-300">Monsoon / Rain Rate:</span>
              <span className="text-white font-bold">{weather ? `${weather.precipitation} mm/h` : '0 mm/h'}</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {weather?.rainFadeRisk || 'Clear Sky (No Fade)'}
            </span>
          </div>

          {/* RF Attenuation Across 5G Bands Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider text-[10px] font-mono">
              Live Specific Path Loss (ITU-R P.676 &amp; P.838)
            </span>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/50 text-[10px] text-slate-400 uppercase font-bold">
                <span>Frequency Band</span>
                <span>Specific Path Loss</span>
                <span className="text-right">Propagation Status</span>
              </div>

              {/* Sub-6GHz */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">3.5 GHz (n78 Band)</span>
                  <span className="text-[9px] text-slate-400">Campus Macro gNodeB</span>
                </div>
                <span className="text-emerald-400 font-bold">
                  {weather ? `${weather.attenuation.n78_3_5GHz} dB/km` : '0.008 dB/km'}
                </span>
                <span className="text-right text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                  Near Zero Loss
                </span>
              </div>

              {/* Wi-Fi 6E */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">6 GHz (Wi-Fi 6E)</span>
                  <span className="text-[9px] text-slate-400">Indoor Lab Mesh APs</span>
                </div>
                <span className="text-sky-400 font-bold">
                  {weather ? `${weather.attenuation.wifi6e_6GHz} dB/km` : '0.016 dB/km'}
                </span>
                <span className="text-right text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold">
                  Optimal
                </span>
              </div>

              {/* mmWave 28 GHz */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">28 GHz (mmWave)</span>
                  <span className="text-[9px] text-slate-400">Ultra-Capacity Beam</span>
                </div>
                <span className="text-amber-400 font-bold">
                  {weather ? `${weather.attenuation.mmWave_28GHz} dB/km` : '0.124 dB/km'}
                </span>
                <span className="text-right text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                  Low Vapor Loss
                </span>
              </div>

              {/* 60 GHz V-Band Oxygen Resonance */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">60 GHz (V-Band)</span>
                  <span className="text-[9px] text-slate-400">Oxygen Absorption Peak</span>
                </div>
                <span className="text-rose-400 font-bold">
                  {weather ? `${weather.attenuation.vBand_60GHz} dB/km` : '15.20 dB/km'}
                </span>
                <span className="text-right text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                  High O₂ Attenuation
                </span>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-500 font-mono text-center">
            Last Updated: {weather ? new Date(weather.timestamp).toLocaleTimeString() : 'Just now'} • Real-Time ITU-R Model
          </p>
        </div>
      </div>
    </div>
  );
};
