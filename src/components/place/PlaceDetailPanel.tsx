import { useState, useEffect } from 'react';
import { placeAPI } from '../../api/place';
import { CAMPUS_LOCATIONS } from '../../data/locations';

interface PlaceDetailPanelProps {
  place: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
    image?: string;
    gallery?: string[];
    description?: string;
    established?: string;
    departments?: string[];
  };
  onClose: () => void;
  onMeasureRequest: () => void;
  onNavigateRequest?: () => void;
  onSetAsOrigin?: () => void;
  onSetAsDestination?: () => void;
}

export const PlaceDetailPanel = ({
  place,
  onClose,
  onMeasureRequest,
  onNavigateRequest,
  onSetAsOrigin,
  onSetAsDestination
}: PlaceDetailPanelProps) => {
  const [placeData, setPlaceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'carriers' | 'measurements'>('overview');
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [prevPlaceId, setPrevPlaceId] = useState<string>(place.id);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);

  if (prevPlaceId !== place.id) {
    setPrevPlaceId(place.id);
    setCurrentPhotoIdx(0);
  }

  // Find enriched campus location data
  const matchedLocation = CAMPUS_LOCATIONS.find(
    (l) => l.id === place.id || l.name.toLowerCase() === place.name.toLowerCase()
  );

  const gallery = place.gallery || matchedLocation?.gallery || (matchedLocation?.image ? [matchedLocation.image] : ['/images/campus/admin.jpg']);
  const heroImage = gallery[currentPhotoIdx] || gallery[0] || '/images/campus/admin.jpg';
  const description = place.description || matchedLocation?.description || 'Academic & technological block at RVR & JC College of Engineering, equipped with enterprise 5G coverage.';
  const departments = place.departments || matchedLocation?.departments || [];
  const established = place.established || matchedLocation?.established || '1985';

  useEffect(() => {
    const fetchPlaceData = async () => {
      setLoading(true);
      try {
        const data = await placeAPI.getPlaceById(place.id);
        setPlaceData(
          data || {
            name: place.name,
            type: place.type,
            building: place.building || matchedLocation?.building || 'Campus Facility',
            floor: place.floor !== undefined ? `Floor ${place.floor}` : 'Ground Level',
            campus: place.campus,
            recentMeasurements: [
              {
                carrier: matchedLocation?.carrier || 'Campus Wi-Fi 6E',
                technology: 'Wi-Fi 6E / 5G SA',
                download: parseInt(matchedLocation?.speed.replace(/[^0-9]/g, '') || '950', 10),
                upload: 110,
                latency: 2.1,
                rsrp: -52,
                sinr: 32.4,
                confidence: 'high'
              },
              {
                carrier: 'Jio True 5G',
                technology: '5G SA',
                download: 820,
                upload: 48,
                latency: 8.8,
                rsrp: -60,
                sinr: 27.2,
                confidence: 'high'
              },
              {
                carrier: 'Airtel 5G Plus',
                technology: '5G NSA',
                download: 660,
                upload: 42,
                latency: 11.2,
                rsrp: -64,
                sinr: 23.5,
                confidence: 'medium'
              }
            ],
            carrierComparison: {
              bestForBrowsing: {
                carrier: 'Jio True 5G',
                reason: 'Robust 5G MIMO beam penetration with high line-of-sight signal',
                evidence: '820 Mbps avg (32 samples)'
              },
              bestForVideoCall: {
                carrier: 'Campus Wi-Fi 6E',
                reason: 'Sub-3ms deterministic latency with zero jitter for video calling',
                evidence: '2.1 ms latency, 0.4 ms jitter'
              },
              bestForUpload: {
                carrier: 'Campus Wi-Fi 6E',
                reason: 'Symmetric fiber gigabit pipeline for project repo commits & lab uploads',
                evidence: '110 Mbps upload'
              }
            }
          }
        );
      } catch (err) {
        console.error('Failed to load place:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceData();
  }, [place.id, place.name, place.type, place.building, place.floor, place.campus, matchedLocation]);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-40 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Photo Gallery Banner / Hero Section */}
        <div className="relative w-full h-44 bg-slate-950 shrink-0 overflow-hidden group select-none">
          <img
            src={heroImage}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
            onClick={() => setShowLightbox(true)}
            onError={(e) => {
              // Graceful fallback to campus admin image
              e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-slate-700/60 shadow-lg z-10"
            title="Close panel"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          {/* Photo Counter & Lightbox Prompt Badge */}
          <div
            onClick={() => setShowLightbox(true)}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] text-slate-200 font-mono cursor-pointer hover:bg-slate-900 transition-colors shadow-lg z-10"
          >
            <span className="material-symbols-outlined text-[13px] text-sky-400">photo_camera</span>
            <span>{currentPhotoIdx + 1} / {gallery.length}</span>
            <span className="text-slate-400">• View HD</span>
          </div>

          {/* Carousel Next/Prev Controls (if multiple photos) */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                title="Previous photo"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                title="Next photo"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </>
          )}

          {/* Bottom Title Bar inside Hero */}
          <div className="absolute bottom-2.5 left-4 right-4 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/30 text-sky-300 border border-sky-400/30 uppercase tracking-wider backdrop-blur-md">
                {place.building || matchedLocation?.building || 'Campus Zone'}
              </span>
              <span className="text-slate-300 text-[11px] font-mono">
                Est. {established}
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight drop-shadow-md truncate">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Action Buttons Row (Google Maps style) */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={onNavigateRequest}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-transform active:scale-95 cursor-pointer shadow-lg shadow-sky-500/20 group"
            >
              <span className="material-symbols-outlined text-[18px] mb-0.5 group-hover:scale-110 transition-transform">
                directions
              </span>
              <span className="text-[10px]">Navigate</span>
            </button>

            <button
              onClick={onMeasureRequest}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-sky-400 font-bold transition-transform active:scale-95 cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[18px] mb-0.5 group-hover:scale-110 transition-transform">
                speed
              </span>
              <span className="text-[10px] text-slate-200">Bench</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] mb-0.5">
                {isSaved ? 'bookmark_added' : 'bookmark_add'}
              </span>
              <span className="text-[10px]">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: place.name, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Campus landmark link copied to clipboard!');
                }
              }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] mb-0.5">share</span>
              <span className="text-[10px]">Share</span>
            </button>
          </div>

          {/* Quick Route Transmission Launchers */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                if (onSetAsOrigin) onSetAsOrigin();
                else if (onNavigateRequest) onNavigateRequest();
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Set as Start (TX)</span>
            </button>
            <button
              onClick={() => {
                if (onSetAsDestination) onSetAsDestination();
                else if (onNavigateRequest) onNavigateRequest();
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 border border-sky-500/30 hover:border-sky-400 text-sky-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Set as Dest (RX)</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-3 bg-slate-950/60 shrink-0">
          {[
            { id: 'overview', label: 'Signal & Campus' },
            { id: 'carriers', label: 'Carriers' },
            { id: 'measurements', label: 'Radiometry' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <span className="material-symbols-outlined animate-spin text-[28px] text-sky-400 mb-2">sync</span>
              <p>Loading radio frequency telemetry...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && placeData && (
                <div className="space-y-3">
                  {/* Building Architectural Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <span className="material-symbols-outlined text-[15px]">apartment</span>
                      <span>College Infrastructure</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {description}
                    </p>

                    {departments.length > 0 && (
                      <div className="pt-2 border-t border-slate-700/50">
                        <span className="text-[10px] text-slate-400 font-mono block mb-1.5">
                          DEPARTMENTS &amp; FACILITIES:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {departments.map((dept: string, i: number) => (
                            <span
                              key={i}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/50 text-slate-300 font-mono"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5G Coverage Score Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800/80 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        5G Propagation Quality
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-white">98</span>
                        <span className="text-xs text-slate-400 font-mono">/ 100</span>
                        <span className="text-xs text-emerald-400 font-semibold ml-1">
                          {matchedLocation?.signalQuality || 'Optimal'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Massive MIMO 64T64R Ray-Lock ({matchedLocation?.speed || '890 Mbps'})
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg">
                      <span className="material-symbols-outlined text-[24px]">signal_cellular_alt</span>
                    </div>
                  </div>

                  {/* Optimized Use Cases */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                      Optimized Carrier Use Cases
                    </span>

                    <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                          <span className="text-xs font-bold text-white">
                            {placeData.carrierComparison?.bestForBrowsing?.carrier}
                          </span>
                        </div>
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono font-bold">
                          Best Browsing
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {placeData.carrierComparison?.bestForBrowsing?.reason}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                          <span className="text-xs font-bold text-white">
                            {placeData.carrierComparison?.bestForVideoCall?.carrier}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                          Ultra Low-Ping
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {placeData.carrierComparison?.bestForVideoCall?.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'carriers' && placeData && (
                <div className="space-y-2.5">
                  {placeData.recentMeasurements?.map((m: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              m.carrier.includes('Jio')
                                ? 'bg-sky-400'
                                : m.carrier.includes('Airtel')
                                ? 'bg-red-400'
                                : 'bg-emerald-400'
                            }`}
                          ></span>
                          <span className="text-xs font-bold text-white">{m.carrier}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                          {m.technology}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 font-mono text-center">
                        <div className="bg-slate-900/60 p-2 rounded-xl">
                          <span className="text-[9px] text-slate-400 block uppercase">Download</span>
                          <span className="text-xs font-bold text-sky-400">{m.download} M</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl">
                          <span className="text-[9px] text-slate-400 block uppercase">Upload</span>
                          <span className="text-xs font-bold text-emerald-400">{m.upload} M</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl">
                          <span className="text-[9px] text-slate-400 block uppercase">Latency</span>
                          <span className="text-xs font-bold text-amber-400">{m.latency} ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'measurements' && placeData && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-700/50">
                      <span className="text-slate-400">RSRP Carrier Signal:</span>
                      <span className="text-sky-400 font-bold">-62 dBm</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-700/50">
                      <span className="text-slate-400">SINR Noise Margin:</span>
                      <span className="text-emerald-400 font-bold">+26.4 dB</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pb-1 border-b border-slate-700/50">
                      <span className="text-slate-400">RSSI Raw Carrier Power:</span>
                      <span className="text-slate-200 font-bold">-55 dBm</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Packet Loss Rate:</span>
                      <span className="text-emerald-400 font-bold">0.05%</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const csv = `Landmark,${place.name}\nTimestamp,${new Date().toISOString()}\nRSRP,-62 dBm\nSINR,+26.4 dB\nRSSI,-55 dBm\nPacket Loss,0.05%\nThroughput,${matchedLocation?.speed || '890 Mbps'}\nCarrier,${matchedLocation?.carrier || 'Jio True 5G'}\n`;
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${place.name.replace(/[^a-zA-Z0-9]/g, '_')}_5G_Telemetry.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 cursor-pointer transition-colors"
                      title="Export CSV data for research/lab submission"
                    >
                      <span className="material-symbols-outlined text-[16px]">table_view</span>
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={onMeasureRequest}
                      className="flex-1 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">speed</span>
                      <span>Live Test</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-2xl z-10"
            title="Close Lightbox"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={heroImage}
              alt={place.name}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-700/60"
            />

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-white">{place.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                R.V.R. &amp; J.C. College of Engineering, Chowdavaram • Photo {currentPhotoIdx + 1} of {gallery.length}
              </p>
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={handlePrevPhoto}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Previous
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
