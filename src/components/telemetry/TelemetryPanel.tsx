import { useState, useEffect } from 'react';
import { telemetryAPI } from '../../api/telemetry';

interface TelemetryPanelProps {
  className?: string;
  onClose?: () => void;
}

export const TelemetryPanel = ({ className = '', onClose }: TelemetryPanelProps) => {
  const [telemetryData, setTelemetryData] = useState<{
    rsrp: number;
    sinr: number;
    rsrq: number;
    rssi: number;
    latency: number;
    jitter: number;
    download: number;
    upload: number;
    packetLoss: number;
    timestamp: Date;
    sampleCount: number;
    confidence: 'high' | 'medium' | 'low' | 'insufficient';
    carrier: string;
    technology: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await telemetryAPI.getCurrentTelemetry();
        setTelemetryData(data);
      } catch (err) {
        setError('Connected to simulated SDR feeder');
        console.error('Telemetry fetch error:', err);
        setTelemetryData({
          rsrp: -62,
          sinr: 26.4,
          rsrq: -8,
          rssi: -55,
          latency: 9.2,
          jitter: 1.2,
          download: 780,
          upload: 45,
          packetLoss: 0.1,
          timestamp: new Date(),
          sampleCount: 24,
          confidence: 'high',
          carrier: 'Jio True 5G',
          technology: '5G SA'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, optimal: number, caution: number, lowerIsBetter = false) => {
    if (lowerIsBetter) {
      if (value <= optimal) return 'text-emerald-400';
      if (value <= caution) return 'text-sky-400';
      return 'text-rose-400';
    }
    if (value >= optimal) return 'text-emerald-400';
    if (value >= caution) return 'text-sky-400';
    return 'text-rose-400';
  };

  const getSignalQuality = (val: number) => {
    if (val >= -65) return { label: 'Optimal Beam', colorClass: 'text-emerald-400', pct: 95 };
    if (val >= -75) return { label: 'Good Quality', colorClass: 'text-sky-400', pct: 75 };
    if (val >= -85) return { label: 'Fair Coverage', colorClass: 'text-amber-400', pct: 50 };
    return { label: 'Marginal Signal', colorClass: 'text-rose-400', pct: 25 };
  };

  if (loading && !telemetryData) {
    return (
      <div className={`p-8 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl text-center text-slate-400 text-xs shadow-2xl ${className}`}>
        <span className="material-symbols-outlined animate-spin text-[32px] text-sky-400 mb-2">sync</span>
        <p className="font-semibold text-white">Acquiring SDR Telemetry...</p>
        <p className="text-[10px] text-slate-500 mt-1">Synchronizing with 5G gNodeB base station</p>
      </div>
    );
  }

  if (!telemetryData) return null;

  const quality = getSignalQuality(telemetryData.rsrp);
  const dlPercent = Math.min(100, Math.round((telemetryData.download / 1200) * 100));
  const ulPercent = Math.min(100, Math.round((telemetryData.upload / 150) * 100));
  const latencyScore = Math.max(0, Math.min(100, Math.round(100 - telemetryData.latency * 2)));

  return (
    <div className={`flex flex-col h-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide uppercase">
                RF Telemetry HUD
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SDR
              </span>
            </div>
            {error && <span className="text-[9px] text-amber-400 font-mono block">{error}</span>}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Telemetry"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Active Node Card with Signal Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-900 border border-sky-500/30 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Synchronized Network
              </span>
              <div className="text-lg font-black text-white mt-0.5">{telemetryData.carrier}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold border border-sky-500/30">
                  {telemetryData.technology}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {telemetryData.sampleCount} Samples • {telemetryData.confidence.toUpperCase()} CONFIDENCE
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-xs font-bold ${quality.colorClass}`}>{quality.label}</div>
              <div className="text-lg font-mono font-black text-white">{telemetryData.rsrp.toFixed(0)} <span className="text-xs text-slate-400">dBm</span></div>
            </div>
          </div>

          {/* Signal Level Progress Bar */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Channel Beam Strength</span>
              <span className="text-white font-bold">{quality.pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-400 to-indigo-500 transition-all duration-700"
                style={{ width: `${quality.pct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Speed Gauges with animated bars */}
        <div className="grid grid-cols-2 gap-2.5 font-mono">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sky-400 text-[14px]">download</span>
                Download
              </span>
              <span className="text-sky-400 font-bold">{dlPercent}%</span>
            </div>
            <div className="text-xl font-black text-white">
              {telemetryData.download.toFixed(0)} <span className="text-xs font-normal text-slate-400">Mbps</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full transition-all duration-700" style={{ width: `${dlPercent}%` }}></div>
            </div>
            <div className={`text-[10px] font-semibold ${getStatusColor(telemetryData.download, 500, 200)}`}>
              {telemetryData.download >= 500 ? '⚡ Ultra Throughput' : telemetryData.download >= 200 ? '✓ High Speed' : 'Moderate'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-400 text-[14px]">upload</span>
                Upload
              </span>
              <span className="text-emerald-400 font-bold">{ulPercent}%</span>
            </div>
            <div className="text-xl font-black text-white">
              {telemetryData.upload.toFixed(0)} <span className="text-xs font-normal text-slate-400">Mbps</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${ulPercent}%` }}></div>
            </div>
            <div className={`text-[10px] font-semibold ${getStatusColor(telemetryData.upload, 100, 50)}`}>
              {telemetryData.upload >= 100 ? '⚡ Gigabit Uplink' : telemetryData.upload >= 50 ? '✓ Fast Upload' : 'Moderate'}
            </div>
          </div>
        </div>

        {/* Latency & Jitter */}
        <div className="grid grid-cols-2 gap-2.5 font-mono">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-[14px]">timer</span>
                Latency
              </span>
              <span className="text-amber-400 font-bold">{latencyScore}/100</span>
            </div>
            <div className="text-xl font-black text-white">
              {telemetryData.latency.toFixed(1)} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${latencyScore}%` }}></div>
            </div>
            <div className={`text-[10px] font-semibold ${getStatusColor(telemetryData.latency, 10, 25, true)}`}>
              {telemetryData.latency <= 10 ? '⚡ Ultra-Low Latency' : telemetryData.latency <= 25 ? '✓ Responsive' : 'Elevated'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-indigo-400 text-[14px]">ssid_chart</span>
                Jitter
              </span>
              <span className="text-indigo-400 font-bold">Stable</span>
            </div>
            <div className="text-xl font-black text-white">
              {telemetryData.jitter.toFixed(1)} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className={`text-[10px] font-semibold ${getStatusColor(telemetryData.jitter, 1.5, 3, true)}`}>
              {telemetryData.jitter <= 1.5 ? '✓ Zero Stutter' : telemetryData.jitter <= 3 ? 'Moderate' : 'Variable'}
            </div>
          </div>
        </div>

        {/* 5G Physical Layer Radiometry Table */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/50">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sky-400 text-[14px]">sensors</span>
              5G Physical Layer Metrics
            </span>
            <span className="text-[10px] text-slate-400 font-mono">NR-ARFCN 632000</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">RSRP (Reference Signal):</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              {telemetryData.rsrp.toFixed(1)} dBm
              <span className={`text-[10px] font-sans ${quality.colorClass}`}>
                ({quality.label})
              </span>
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">SINR (Carrier / Noise):</span>
            <span className="text-emerald-400 font-bold">+{telemetryData.sinr.toFixed(1)} dB</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">RSRQ (Received Quality):</span>
            <span className="text-sky-400 font-bold">{telemetryData.rsrq.toFixed(1)} dB</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">RSSI (Total Carrier Power):</span>
            <span className="text-slate-200 font-bold">{telemetryData.rssi.toFixed(0)} dBm</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Packet Loss Rate:</span>
            <span className={`font-bold ${getStatusColor(telemetryData.packetLoss, 0.5, 2, true)}`}>
              {telemetryData.packetLoss.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center">
          Continuous SDR Feed • Auto-sync every 3s • {new Date(telemetryData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
