import { useState, useEffect } from 'react';
import { carrierAPI } from '../../api/carrier';

export const CarrierPanel = ({
  showPlaceDetail,
  selectedPlace,
  onClose
}: {
  showPlaceDetail?: boolean;
  selectedPlace?: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  } | null;
  onClose?: () => void;
}) => {
  const [carrierData, setCarrierData] = useState<Array<any>>([]);
  const [carrierComparison, setCarrierComparison] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  void showPlaceDetail;

  useEffect(() => {
    const fetchCarrierData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, comparison] = await Promise.all([
          carrierAPI.getCarrierData(),
          carrierAPI.getCarrierComparison()
        ]);
        setCarrierData(data);
        setCarrierComparison(comparison);
      } catch (err) {
        setError('Failed to fetch carrier benchmarks');
        console.error('Carrier fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrierData();
  }, []);

  const parseSpeed = (val: string) => {
    const num = parseFloat(val.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const maxSpeed = Math.max(...carrierData.map((c) => parseSpeed(c.downloadSpeed)), 1000);

  return (
    <div className="fixed top-4 left-4 z-40 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-950/70 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              Carrier Benchmarks
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                5G & Wi-Fi
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
              {selectedPlace ? selectedPlace.name : 'R.V.R. & J.C. Campus Wide'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <span className="material-symbols-outlined animate-spin text-[28px] text-sky-400 mb-2">sync</span>
            <p>Benchmarking campus cellular carriers & Wi-Fi nodes...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Networks Evaluated ({carrierData.length})</span>
              <span>Throughput Ranking</span>
            </div>

            {carrierData.map((carrier, idx) => {
              const dl = parseSpeed(carrier.downloadSpeed);
              const pct = Math.round((dl / maxSpeed) * 100);
              const isSelected = selectedIdx === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(isSelected ? null : idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-400 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: carrier.color }}
                      ></span>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          {carrier.name}
                          {idx === 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                              #1 SPEED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                            {carrier.technology}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{carrier.band}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-sky-400 font-mono">
                        {carrier.downloadSpeed.replace(' Mbps', '')} <span className="text-[10px] text-slate-400 font-normal">Mbps</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block">Peak Download</span>
                    </div>
                  </div>

                  {/* Horizontal Speed Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: carrier.color }}
                      ></div>
                    </div>
                  </div>

                  {/* 4-Column Metric Grid */}
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-center pt-2.5">
                    <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/40">
                      <span className="text-[8px] text-slate-400 block uppercase">Down</span>
                      <span className="text-[11px] font-bold text-sky-400">
                        {carrier.downloadSpeed.replace(' Mbps', 'M')}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/40">
                      <span className="text-[8px] text-slate-400 block uppercase">Up</span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        {carrier.uploadSpeed.replace(' Mbps', 'M')}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/40">
                      <span className="text-[8px] text-slate-400 block uppercase">Ping</span>
                      <span className="text-[11px] font-bold text-amber-400">
                        {carrier.latency.replace(' ms', 'ms')}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/40">
                      <span className="text-[8px] text-slate-400 block uppercase">Loss</span>
                      <span className="text-[11px] font-bold text-slate-200">
                        {carrier.packetLoss}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Signal Details */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 font-mono border-t border-slate-700/40 mt-2">
                    <span>RSRP: {carrier.rsrp} • SINR: {carrier.sinr}</span>
                    <span className="text-emerald-400 font-semibold capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {carrier.confidence} Confidence
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Carrier Recommendation Cards */}
            {carrierComparison && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-[14px]">military_tech</span>
                  Campus Optimization Recommendations
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-sky-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      Best for Web Browsing & Streaming
                    </span>
                    <span className="text-sky-400">{carrierComparison.bestForBrowsing?.carrier}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{carrierComparison.bestForBrowsing?.reason}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Best for Zoom & Teams Calls
                    </span>
                    <span className="text-emerald-400">{carrierComparison.bestForVideoCall?.carrier}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{carrierComparison.bestForVideoCall?.reason}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
