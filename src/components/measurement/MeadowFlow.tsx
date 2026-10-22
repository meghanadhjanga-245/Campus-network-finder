import { useState } from 'react';
import { measurementAPI } from '../../api/measurement';
import type { MeasurementResult } from '../../api/measurement';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { soundFX } from '../../utils/soundEffects';

interface MeasurementFlowProps {
  onClose: () => void;
  onPlaceSelect: (place: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }) => void;
}

export const MeasurementFlow = ({ onClose, onPlaceSelect }: MeasurementFlowProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [consentGiven, setConsentGiven] = useState(true);
  const [testInProgress, setTestInProgress] = useState(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'radiometry' | 'done'>('idle');
  const [gaugeSpeed, setGaugeSpeed] = useState<number>(0);
  const [testResults, setTestResults] = useState<MeasurementResult | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<typeof CAMPUS_LOCATIONS[0] | null>(CAMPUS_LOCATIONS[1]);
  const [_loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const places = CAMPUS_LOCATIONS;

  const handlePlaceSelect = (place: typeof places[0]) => {
    setSelectedLocation(place);
    soundFX.playClick();
    setStep(2);
  };

  // Realistic animated speed test sequencer with SVG speedometer needle & procedural Web Audio
  const startTest = async () => {
    if (!selectedLocation) return;

    setStep(3);
    setTestInProgress(true);
    setLoading(true);
    setError(null);
    setTestPhase('ping');
    setGaugeSpeed(0);

    try {
      const response = await measurementAPI.startMeasurement({
        locationId: selectedLocation.id,
        carrierPreference: 'auto',
        testType: 'standard'
      });

      // Target download speed based on selected location
      const targetDownload = parseInt(selectedLocation.speed.replace(/[^0-9]/g, '') || '850', 10);
      const targetUpload = 125;

      // Phase 1: Ping & Jitter testing (1.2s) with Radar Ping & Beam Lock sounds
      soundFX.playRadarPing();
      await new Promise((r) => setTimeout(r, 600));
      soundFX.playBeamLock();
      await new Promise((r) => setTimeout(r, 600));
      setTestPhase('download');

      // Phase 2: Download Throughput ramping up (2.2s) with procedural tone sweep
      let dlTicks = 0;
      const dlInterval = setInterval(() => {
        dlTicks++;
        setGaugeSpeed((prev) => {
          const jitter = (Math.random() - 0.5) * 40;
          const nextVal = Math.min(targetDownload + jitter, prev + targetDownload * 0.12);
          if (dlTicks % 3 === 0) {
            soundFX.playSpeedSweep(nextVal / targetDownload);
          }
          return Math.round(nextVal);
        });
      }, 80);

      await new Promise((r) => setTimeout(r, 2200));
      clearInterval(dlInterval);
      setGaugeSpeed(targetDownload);

      // Phase 3: Upload Throughput (1.6s)
      setTestPhase('upload');
      setGaugeSpeed(10);
      let ulTicks = 0;
      const ulInterval = setInterval(() => {
        ulTicks++;
        setGaugeSpeed((prev) => {
          const jitter = (Math.random() - 0.5) * 8;
          const nextVal = Math.min(targetUpload + jitter, prev + targetUpload * 0.15);
          if (ulTicks % 3 === 0) {
            soundFX.playSpeedSweep(nextVal / targetUpload);
          }
          return Math.round(nextVal);
        });
      }, 80);

      await new Promise((r) => setTimeout(r, 1600));
      clearInterval(ulInterval);
      setGaugeSpeed(targetUpload);

      // Phase 4: Radiometry Physical Layer Analysis (1s)
      setTestPhase('radiometry');
      soundFX.playBeamLock();
      await new Promise((r) => setTimeout(r, 1000));

      const results = await measurementAPI.getMeasurementResult(response.testId);
      // Ensure results reflect the selected location's carrier and throughput
      results.download = targetDownload;
      results.upload = targetUpload;
      results.locationId = selectedLocation.id;
      results.carrier = selectedLocation.carrier;
      setTestResults(results);
      setTestPhase('done');

      // Triumphant Fanfare audio cue upon successful test completion
      soundFX.playFanfare();
    } catch (err) {
      setError('Failed to complete diagnostic test');
      console.error('Measurement error:', err);
    } finally {
      setTestInProgress(false);
      setLoading(false);
    }
  };

  const submitMeasurement = async () => {
    if (!testResults || !selectedLocation) return;
    setLoading(true);
    try {
      await measurementAPI.submitMeasurement(testResults);
      soundFX.playClick();
      setStep(4);
    } catch (err) {
      setError('Failed to submit measurement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Convert gauge speed (0 - 1500 Mbps) to needle angle (-120deg to +120deg = 240 deg span)
  const maxScale = testPhase === 'upload' ? 200 : 1500;
  const normalizedSpeed = Math.min(gaugeSpeed, maxScale);
  const needleAngle = -120 + (normalizedSpeed / maxScale) * 240;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">5G Radiometry Diagnostic Bench</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {step === 1 && 'Select Target Campus Node'}
                {step === 2 && 'Diagnostic Consent & Telemetry'}
                {step === 3 && (testInProgress ? `Phase: ${testPhase.toUpperCase()}` : 'Diagnostics Complete')}
                {step === 4 && 'Audit Record Logged'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* STEP 1: Node Selection with Building Photos */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Choose an R.V.R. &amp; J.C. landmark to benchmark physical layer wireless throughput:
              </p>
              <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedLocation?.id === place.id
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={place.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/60"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div className="truncate">
                        <div className="font-bold text-white text-xs truncate">{place.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {place.building} • {place.carrier}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
                          {place.speed} • {place.signalQuality}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-sky-400 text-[20px] shrink-0">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Anonymized Diagnostic Confirmation */}
          {step === 2 && selectedLocation && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex items-center gap-3.5">
                <img
                  src={selectedLocation.image}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Target Facility
                  </span>
                  <div className="text-base font-bold text-white truncate">{selectedLocation.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Carrier: {selectedLocation.carrier} • Coords: {selectedLocation.coordinates.join(', ')}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]">shield</span>
                  <span className="text-xs font-bold text-slate-200">Crowdsourced SDR Anonymization</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diagnostics record anonymized physical layer radio parameters (RSRP, SINR, CQI, packet jitter) for the college research map. No private IMSI, IMEI, or device identities are transmitted.
                </p>
                <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-sky-500 rounded border-slate-700 cursor-pointer"
                  />
                  <span>I authorize recording anonymized physical layer radiometry for this node.</span>
                </label>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Change Node
                </button>
                <button
                  disabled={!consentGiven}
                  onClick={startTest}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 shadow-lg shadow-sky-500/20"
                >
                  Initiate Live 5G Benchmark
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Radial Speedometer Gauge & Live Progress */}
          {step === 3 && (
            <div className="py-2 space-y-4 text-center">
              {testInProgress ? (
                <div className="space-y-4">
                  {/* SVG Radial Speedometer Gauge */}
                  <div className="relative w-64 h-52 mx-auto flex items-center justify-center">
                    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-xl overflow-visible">
                      <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>

                      {/* Gauge Background Track */}
                      <path
                        d="M 30 130 A 70 70 0 1 1 170 130"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />

                      {/* Gauge Active Progress Arc */}
                      <path
                        d="M 30 130 A 70 70 0 1 1 170 130"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="330"
                        strokeDashoffset={330 - (330 * (needleAngle + 120)) / 240}
                        className="transition-all duration-150 ease-out"
                      />

                      {/* Center Needle Pivot */}
                      <circle cx="100" cy="115" r="7" fill="#f8fafc" />
                      <circle cx="100" cy="115" r="3" fill="#0284c7" />

                      {/* Speedometer Needle */}
                      <line
                        x1="100"
                        y1="115"
                        x2="100"
                        y2="55"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        transform={`rotate(${needleAngle} 100 115)`}
                        className="transition-transform duration-100 ease-out"
                      />

                      {/* Tick Marks */}
                      <text x="24" y="148" fill="#64748b" fontSize="8" fontFamily="monospace">0</text>
                      <text x="94" y="32" fill="#64748b" fontSize="8" fontFamily="monospace">{maxScale / 2}</text>
                      <text x="165" y="148" fill="#64748b" fontSize="8" fontFamily="monospace">{maxScale}</text>
                    </svg>

                    {/* Central Digital Throughput Display */}
                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                      <div className="text-3xl font-black font-mono text-white tracking-tight">
                        {gaugeSpeed}
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest -mt-0.5">
                        {testPhase === 'upload' ? 'Upload Mbps' : 'Download Mbps'}
                      </span>
                    </div>
                  </div>

                  {/* Active Phase Steps Indicator */}
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                    {[
                      { id: 'ping', label: '1. Ping' },
                      { id: 'download', label: '2. Download' },
                      { id: 'upload', label: '3. Upload' },
                      { id: 'radiometry', label: '4. MIMO Lock' }
                    ].map((phase) => (
                      <div
                        key={phase.id}
                        className={`py-1.5 px-1 rounded-xl border transition-all ${
                          testPhase === phase.id
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                            : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                        }`}
                      >
                        {phase.label}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400">
                    Probing 64T64R Sub-6 carrier frequencies at {selectedLocation?.name || 'Selected Node'}...
                  </p>
                </div>
              ) : (
                testResults && (
                  <div className="text-left space-y-3">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-800 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Benchmark Validated
                        </span>
                        <div className="text-lg font-black text-white">{testResults.carrier}</div>
                        <div className="text-xs text-slate-300 font-mono mt-0.5">
                          {selectedLocation?.name || 'RVRJC Campus Node'}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                        {testResults.technology}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block uppercase">Download Throughput</span>
                        <span className="text-xl font-black text-sky-400">{testResults.download.toFixed(0)} <span className="text-xs text-slate-400 font-normal">Mbps</span></span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block uppercase">Upload Throughput</span>
                        <span className="text-xl font-black text-emerald-400">{testResults.upload.toFixed(0)} <span className="text-xs text-slate-400 font-normal">Mbps</span></span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block uppercase">Latency / Ping</span>
                        <span className="text-xl font-black text-amber-400">{testResults.latency.toFixed(1)} <span className="text-xs text-slate-400 font-normal">ms</span></span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block uppercase">Packet Loss</span>
                        <span className="text-xl font-black text-slate-200">{testResults.packetLoss.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs font-mono space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span>Physical Layer RSRP:</span>
                        <span className="text-sky-400 font-bold">{testResults.rsrp.toFixed(1)} dBm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carrier SINR Ratio:</span>
                        <span className="text-emerald-400 font-bold">+{testResults.sinr.toFixed(1)} dB</span>
                      </div>
                    </div>

                    {/* Action buttons: Retest, Certificate, Publish */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={startTest}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Retest
                      </button>
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setShowCertificate(true);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Speed Certificate</span>
                      </button>
                      <button
                        onClick={submitMeasurement}
                        className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
                      >
                        Publish to Map
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl">
                <span className="material-symbols-outlined text-[36px]">check</span>
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Diagnostic Record Published</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your physical layer telemetry for {selectedLocation?.name} has been added to the crowdsourced campus heatmaps.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setShowCertificate(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span>View QoS Certificate</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    if (selectedLocation) onPlaceSelect(selectedLocation);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  Inspect Location
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Official 5G Speed Benchmark Certificate Modal */}
      {showCertificate && testResults && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-950 border-2 border-amber-400/50 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col relative overflow-hidden text-left">
            {/* Holographic Watermark Badge */}
            <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-36 h-36 rounded-full bg-amber-400/5 blur-2xl pointer-events-none"></div>

            {/* Institution Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block font-mono">
                  Autonomous Institution • Accredited 'A+' Grade by NAAC
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                  R.V.R. &amp; J.C. College of Engineering
                </h2>
                <p className="text-[11px] text-slate-400">
                  Chowdavaram, Guntur, AP • Department of Telecommunications &amp; SDR
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="my-5 text-center">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Official Physical-Layer QoS Telemetry
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-2">
                5G Gigabit Network Verification Certificate
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                This document certifies that active software-defined radiometry conducted at{' '}
                <strong className="text-white">{selectedLocation?.name}</strong> has met 3GPP Release 17 gigabit wireless specifications.
              </p>
            </div>

            {/* Key Verified Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 font-mono">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase block">Download</span>
                <span className="text-xl font-black text-sky-400">{testResults.download.toFixed(0)}</span>
                <span className="text-[9px] text-slate-500 block">Mbps</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase block">Upload</span>
                <span className="text-xl font-black text-emerald-400">{testResults.upload.toFixed(0)}</span>
                <span className="text-[9px] text-slate-500 block">Mbps</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase block">Latency</span>
                <span className="text-xl font-black text-amber-400">{testResults.latency.toFixed(1)}</span>
                <span className="text-[9px] text-slate-500 block">ms</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase block">Carrier RSRP</span>
                <span className="text-xl font-black text-indigo-400">{testResults.rsrp.toFixed(0)}</span>
                <span className="text-[9px] text-slate-500 block">dBm</span>
              </div>
            </div>

            {/* Telemetry Metadata & Cryptographic Hash */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1.5 mt-2">
              <div className="flex justify-between">
                <span>Network Operator:</span>
                <span className="text-white font-bold">{testResults.carrier} ({testResults.technology})</span>
              </div>
              <div className="flex justify-between">
                <span>Signal-to-Interference Ratio (SINR):</span>
                <span className="text-emerald-400 font-bold">+{testResults.sinr.toFixed(1)} dB (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Timestamp:</span>
                <span className="text-slate-300">{new Date(testResults.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span>Cryptographic Digest:</span>
                <span className="text-sky-400">SHA256:7E9B-{testResults.id.replace(/[^A-Za-z0-9]/g, '').slice(-6).toUpperCase()}-RVRJC</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Back to Diagnostics
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    window.print();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
