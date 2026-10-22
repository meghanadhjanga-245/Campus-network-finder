import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { MapView } from './components/map/MapView';
import { CAMPUS_LOCATIONS } from './data/locations';
import { calculateDynamicRoute } from './data/navigationRoutes';
import { TelemetryPanel } from './components/telemetry/TelemetryPanel';
import { CarrierPanel } from './components/carrier/CarrierPanel';
import { Visualization3D } from './components/visualization/Visualization3D';
import { PlaceDetailPanel } from './components/place/PlaceDetailPanel';
import { MeasurementFlow } from './components/measurement/MeadowFlow';
import { ChatBot } from './components/chat/ChatBot';
import { AdminConsole } from './components/admin/AdminConsole';
import { RouteNavigationPanel } from './components/navigation/RouteNavigationPanel';
import { TimeSlider } from './components/timeline/TimeSlider';
import { DeadZoneReportModal } from './components/report/DeadZoneReportModal';
import { AuditReportModal } from './components/audit/AuditReportModal';
import { FloorSelector } from './components/floor/FloorSelector';
import { AtmosphericTelemetryModal } from './components/weather/AtmosphericTelemetryModal';
import { WorldwideSignalGlobe } from './components/globe/WorldwideSignalGlobe';
import { soundFX } from './utils/soundEffects';
import { fetchLiveGunturRFWeather } from './api/weather';
import type { LiveRFWeather } from './api/weather';

function App() {
  const [selectedCampus, setSelectedCampus] = useState('RVRJC College of Engineering');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street' | 'blueprint' | 'floor-plan'>('floor-plan');
  const [is3D, setIs3D] = useState(true);

  // Search & Places
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
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
  } | null>(null);
  const [is3DTwinFullscreen, setIs3DTwinFullscreen] = useState(false);

  // New High-Impact Features State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showBeams, setShowBeams] = useState(false);
  // 5G Route Engine Active by Default (Matching User GIS View)
  const [showNavigation, setShowNavigation] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState<'shortest' | 'optimal-5g'>('optimal-5g');
  const [showTimeSlider, setShowTimeSlider] = useState(false);
  const [_simulatedHour, setSimulatedHour] = useState(13);
  const [showDeadZoneModal, setShowDeadZoneModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [navOriginId, setNavOriginId] = useState<string>('admin-001'); // 05. Administrative Block
  const [navDestId, setNavDestId] = useState<string>('lib-001'); // 01. Hi-Tech Block
  const [navFitTick, setNavFitTick] = useState<number>(0);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [isGlobalView, setIsGlobalView] = useState(false);

  // 5G Slicing, Carrier Heatmap Filter & Live Weather State
  const [activeSlice, setActiveSlice] = useState<'all' | 'embb' | 'urllc' | 'mmtc'>('all');
  const [activeCarrierFilter, setActiveCarrierFilter] = useState<'all' | 'jio' | 'airtel' | 'wifi'>('all');
  const [liveWeather, setLiveWeather] = useState<LiveRFWeather | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());

  // Base Panel Visibilities
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);
  const [showMeasurementFlow, setShowMeasurementFlow] = useState(false);
  const [showCarrierPanel, setShowCarrierPanel] = useState(false);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState(false);
  const [show3DTwin, setShow3DTwin] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close panels or search on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (is3DTwinFullscreen) {
          setIs3DTwinFullscreen(false);
          return;
        }
        if (isGlobalView) {
          setIsGlobalView(false);
          return;
        }
        setShowSearchDropdown(false);
        setShowPlaceDetail(false);
        setShowCarrierPanel(false);
        setShowTelemetryPanel(false);
        setShowMeasurementFlow(false);
        setShowChatBot(false);
        setShowNavigation(false);
        setShowTimeSlider(false);
        setShowDeadZoneModal(false);
        setShowAuditModal(false);
        setShowWeatherModal(false);
        setShowFloorSelector(false);
        setShowAdminConsole(false);
        setShowLayersDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DTwinFullscreen, isGlobalView]);

  useEffect(() => {
    fetchLiveGunturRFWeather()
      .then((data) => setLiveWeather(data))
      .catch((err) => console.warn('Weather fetch notice:', err));
  }, []);

  // Filter campus locations based on search query
  const filteredLocations = CAMPUS_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: typeof CAMPUS_LOCATIONS[0]) => {
    setSelectedPlace(loc);
    setShowPlaceDetail(true);
    setShowCarrierPanel(false);
    setShowTelemetryPanel(false);
    setShowSearchDropdown(false);
    setSearchQuery(loc.name);
    if (loc.building) {
      setShowFloorSelector(true);
      setCurrentFloor(typeof loc.floor === 'number' ? loc.floor : 0);
    }
  };

  const activeRoute = useMemo(() => {
    if (!showNavigation) return null;
    const r = calculateDynamicRoute(navOriginId, navDestId, selectedRouteId);
    return { ...r, tick: navFitTick };
  }, [showNavigation, navOriginId, navDestId, selectedRouteId, navFitTick]);

  void setSelectedCampus;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* 1. Full-screen Interactive Cartographic Canvas (Google Maps) */}
      <MapView
        selectedPlace={selectedPlace}
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
          setShowPlaceDetail(true);
          setShowCarrierPanel(false);
          setShowTelemetryPanel(false);
          if (place.building) {
            setShowFloorSelector(true);
          }
        }}
        onPlaceDeselect={() => setShowPlaceDetail(false)}
        onMeasurementRequest={() => setShowMeasurementFlow(true)}
        mapStyle={mapStyle}
        is3D={is3D}
        onToggle3D={() => setIs3D(!is3D)}
        showHeatmap={showHeatmap}
        showBeams={showBeams}
        selectedRoute={activeRoute}
        currentFloor={currentFloor}
        isGlobalView={isGlobalView}
        onToggleGlobalView={() => setIsGlobalView(!isGlobalView)}
        activeSlice={activeSlice}
        activeCarrierFilter={activeCarrierFilter}
      />

      {/* 2. Top-Left Floating Google Maps Search Box & Action Chips */}
      <div
        className="absolute top-4 left-4 z-30 flex flex-col gap-2.5 max-w-[calc(100vw-2rem)]"
        ref={searchContainerRef}
      >
        {/* Search Input Card */}
        <div className="w-96 max-w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex items-center px-3.5 py-2.5 gap-2.5 transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/30">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search RVRJC buildings, labs, gates..."
            className="flex-1 bg-transparent border-none text-white text-xs placeholder-slate-400 focus:outline-none"
          />

          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
          )}

          {/* Iconic Google Maps Directions Circular Button */}
          <button
            onClick={() => {
              const next = !showNavigation;
              setShowNavigation(next);
              if (next) {
                if (selectedPlace && selectedPlace.id !== 'gate-main') {
                  setNavOriginId('gate-main');
                  setNavDestId(selectedPlace.id);
                }
                setIsGlobalView(false);
                setShowPlaceDetail(false);
                setShowCarrierPanel(false);
                setShowTelemetryPanel(false);
                setNavFitTick((t) => t + 1);
              }
            }}
            className="w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md shadow-sky-500/20"
            title="Directions / 5G Navigation"
          >
            <span className="material-symbols-outlined text-[16px]">directions</span>
          </button>
        </div>

        {/* Search Autocomplete Dropdown */}
        {showSearchDropdown && (
          <div className="w-96 max-w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              Campus Facilities &amp; 5G Nodes ({filteredLocations.length})
            </div>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700/60 shadow-inner">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{loc.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {loc.building} • {loc.type}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {loc.speed}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching campus location found.
              </div>
            )}
          </div>
        )}

        {/* Google Maps Horizontal Filter Chips Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-2rem)]">
          {/* Worldwide Signal Mesh Toggle */}
          <button
            onClick={() => {
              setIsGlobalView(!isGlobalView);
              setShowPlaceDetail(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              isGlobalView
                ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 border-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-400/30'
                : 'bg-slate-900/95 text-slate-100 border-emerald-500/50 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">
              public
            </span>
            <span>{isGlobalView ? 'Orbital Mesh Active' : 'Worldwide Signal Mesh'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Speed Test */}
          <button
            onClick={() => setShowMeasurementFlow(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500 text-slate-950 hover:bg-sky-400 text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">speed</span>
            <span>Speed Test</span>
          </button>

          {/* 5G RF Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showHeatmap
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
            <span>5G Heatmap</span>
          </button>

          {/* Massive MIMO Beams Toggle */}
          <button
            onClick={() => setShowBeams(!showBeams)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showBeams
                ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>MIMO Beams</span>
          </button>

          {/* 5G Wayfinder Navigation */}
          <button
            onClick={() => {
              const next = !showNavigation;
              setShowNavigation(next);
              if (next) {
                if (selectedPlace && selectedPlace.id !== 'gate-main') {
                  setNavOriginId('gate-main');
                  setNavDestId(selectedPlace.id);
                }
                setIsGlobalView(false);
                setShowPlaceDetail(false);
                setShowCarrierPanel(false);
                setShowTelemetryPanel(false);
                setShow3DTwin(false);
                setNavFitTick((t) => t + 1);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showNavigation
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_walk</span>
            <span>5G Wayfinder</span>
          </button>

          {/* 24h Timeline Congestion Scrubber */}
          <button
            onClick={() => setShowTimeSlider(!showTimeSlider)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showTimeSlider
                ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>24h Timeline</span>
          </button>

          {/* Carriers */}
          <button
            onClick={() => {
              setShowCarrierPanel(!showCarrierPanel);
              setShowPlaceDetail(false);
              setShowTelemetryPanel(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showCarrierPanel
                ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">cell_tower</span>
            <span>Carriers</span>
          </button>

          {/* Live Signal */}
          <button
            onClick={() => {
              setShowTelemetryPanel(!showTelemetryPanel);
              setShowPlaceDetail(false);
              setShowCarrierPanel(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              showTelemetryPanel
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rss_feed</span>
            <span>Live Signal</span>
          </button>

          {/* Dead-Zone Report Action */}
          <button
            onClick={() => setShowDeadZoneModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>Report Dead-Zone</span>
          </button>

          {/* Telecom Audit Report */}
          <button
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold shadow-lg border border-slate-700/80 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Audit Report</span>
          </button>

          {/* Atmospheric RF Attenuation */}
          <button
            onClick={() => setShowWeatherModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold shadow-lg border border-slate-700/80 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">
              {liveWeather?.weatherIcon || 'cloud'}
            </span>
            <span>
              Atmospheric RF ({liveWeather ? `${Math.round(liveWeather.temperature)}°C` : '31°C'})
            </span>
            {liveWeather && liveWeather.precipitation > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-mono border border-sky-500/30">
                {liveWeather.precipitation}mm/h
              </span>
            )}
          </button>

          {/* 3D MIMO Twin */}
          <button
            onClick={() => setShow3DTwin(!show3DTwin)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border ${
              show3DTwin
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
            <span>3D Twin</span>
          </button>

          {/* AI Assistant */}
          <button
            onClick={() => setShowChatBot(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold shadow-lg border border-slate-700/80 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span>AI Assistant</span>
          </button>

          {/* Admin Console */}
          <button
            onClick={() => setShowAdminConsole(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Admin Console</span>
          </button>
        </div>

        {/* 5G Network Slicing & Carrier Heatmap Sub-Bar (Visible when Heatmap is Active) */}
        {showHeatmap && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150 max-w-[calc(100vw-2rem)]">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              5G Slice:
            </span>
            {[
              { id: 'all', label: 'Universal (All)' },
              { id: 'embb', label: 'eMBB (Gigabit)' },
              { id: 'urllc', label: 'URLLC (<10ms)' },
              { id: 'mmtc', label: 'mMTC (Mass IoT)' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveSlice(s.id as any);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSlice === s.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}

            <div className="w-[1px] h-3.5 bg-slate-700/80 shrink-0 mx-1"></div>

            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider shrink-0">Carrier:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'jio', label: 'Jio True 5G' },
              { id: 'airtel', label: 'Airtel 5G+' },
              { id: 'wifi', label: 'Wi-Fi 6E' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCarrierFilter(c.id as any);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCarrierFilter === c.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Top-Right Floating Live Telemetry Pill & Profile */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2.5">
        {/* Live Signal Badge */}
        <div
          onClick={() => {
            setShowTelemetryPanel(true);
            setShowPlaceDetail(false);
            setShowCarrierPanel(false);
          }}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl hover:border-sky-400 transition-all cursor-pointer group"
          title="Click to view live SDR telemetry"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400 font-bold">
              5G SA • Active
            </span>
            <span className="text-xs font-mono font-bold text-white group-hover:text-sky-400 transition-colors">
              780 Mbps <span className="text-[10px] text-slate-400 font-normal">• 9.2ms</span>
            </span>
          </div>
        </div>

        {/* Procedural Web Audio FX Toggle */}
        <button
          onClick={() => {
            const nextMuted = soundFX.toggleMute();
            setIsMuted(nextMuted);
          }}
          className={`w-10 h-10 rounded-2xl backdrop-blur-xl border shadow-xl flex items-center justify-center transition-all cursor-pointer ${
            isMuted
              ? 'bg-slate-900/90 border-slate-700/80 text-slate-500 hover:text-slate-300'
              : 'bg-sky-500/20 border-sky-400/40 text-sky-400 hover:bg-sky-500/30'
          }`}
          title={isMuted ? 'Procedural Sound FX: Muted (Click to enable audio)' : 'Procedural Sound FX: Active (Click to mute)'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* GIS Active Telemetry Pill from User GIS Screenshot */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl font-mono text-[11px]">
          <span className="text-slate-300 font-bold">CampusSignal</span>
          <span className="text-slate-600">//</span>
          <span className="text-slate-400">RVRJC CE Guntur (16.2558° N, 80.3238° E)</span>
          <span className="w-1 h-3 bg-slate-700"></span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GIS Active
          </span>
          <span className="text-slate-500">• 1,428 samples</span>
        </div>
      </div>

      {/* 4. Bottom-Left Google Maps Layers Card & Menu */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2 items-start">
        {/* Layers Selector Dropdown Menu */}
        {showLayersDropdown && (
          <div className="mb-2 p-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col gap-1 w-44 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Basemap View
            </span>
            {[
              { id: 'satellite', label: 'Ultra-HD Satellite', icon: 'satellite_alt' },
              { id: 'floor-plan', label: 'Dark Cartography', icon: 'dark_mode' },
              { id: 'street', label: 'Street Map', icon: 'map' },
              { id: 'blueprint', label: 'Light Blueprint', icon: 'architecture' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setMapStyle(s.id as any);
                  setShowLayersDropdown(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  mapStyle === s.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowLayersDropdown(!showLayersDropdown)}
          className="group flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 hover:border-sky-400 p-1 shadow-2xl transition-all active:scale-95 cursor-pointer"
          title="Toggle Layers & Satellite"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold group-hover:scale-105 transition-transform shadow-md">
            <span className="material-symbols-outlined text-[18px]">layers</span>
          </div>
          <span className="text-[9px] font-bold text-slate-200 mt-0.5 uppercase tracking-wider">
            Layers
          </span>
        </button>
      </div>

      {/* 5. Bottom-Right Google Maps Floating Controls Stack */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 items-end">
        {/* Map Control Buttons */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Worldwide Globe / Campus toggle button */}
          <button
            onClick={() => {
              setIsGlobalView(!isGlobalView);
              setShowPlaceDetail(false);
            }}
            className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer border-b border-slate-800 ${
              isGlobalView ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-200 hover:text-white hover:bg-slate-800'
            }`}
            title={isGlobalView ? 'Focus RVRJC Campus' : 'Worldwide Signal Mesh'}
          >
            <span className="material-symbols-outlined text-[20px]">public</span>
          </button>

          <button
            onClick={() => setIs3D(!is3D)}
            className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-800 font-mono text-xs font-bold"
            title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
          >
            {is3D ? '3D' : '2D'}
          </button>

          <button
            onClick={() => {
              setIsGlobalView(false);
              setSelectedPlace({
                id: 'center',
                name: selectedCampus,
                type: 'campus',
                campus: selectedCampus
              });
            }}
            className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Recenter Campus"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Worldwide Signal Mesh 3D Holographic Twin (Earth at Night & Global Signals) */}
      {isGlobalView && (
        <WorldwideSignalGlobe
          onClose={() => setIsGlobalView(false)}
          onFocusCampus={() => {
            setIsGlobalView(false);
            setSelectedPlace({
              id: 'admin-001',
              name: 'Main Block (Admin)',
              type: 'building',
              building: 'Main Block',
              campus: 'RVRJC College of Engineering'
            });
          }}
        />
      )}

      {/* 5. Vertical Floor Selector (When inspecting building with multiple floors) */}
      {showFloorSelector && selectedPlace && (
        <FloorSelector
          currentFloor={currentFloor}
          onFloorChange={(lvl) => setCurrentFloor(lvl)}
          buildingName={selectedPlace.name}
          onClose={() => setShowFloorSelector(false)}
        />
      )}

      {/* 6. Pedestrian 5G Navigation Wayfinder Panel */}
      {showNavigation && (
        <RouteNavigationPanel
          onClose={() => setShowNavigation(false)}
          originId={navOriginId}
          destinationId={navDestId}
          onOriginChange={setNavOriginId}
          onDestinationChange={setNavDestId}
          selectedRouteId={selectedRouteId}
          onSelectRoute={(id) => setSelectedRouteId(id)}
          onCenterPath={() => setNavFitTick((t) => t + 1)}
        />
      )}

      {/* 7. Bottom 24-Hour Network Congestion Time Slider */}
      {showTimeSlider && (
        <TimeSlider
          onTimeChange={(hr) => setSimulatedHour(hr)}
          onClose={() => setShowTimeSlider(false)}
        />
      )}

      {/* 8. Dead-Zone Crowdsource Report Modal */}
      {showDeadZoneModal && (
        <DeadZoneReportModal
          onClose={() => setShowDeadZoneModal(false)}
          selectedLocationName={selectedPlace ? selectedPlace.name : 'Central Campus'}
        />
      )}

      {/* 9. Telecom RF Audit & Regulatory Compliance Modal */}
      {showAuditModal && <AuditReportModal onClose={() => setShowAuditModal(false)} />}

      {/* 9b. Atmospheric RF Propagation & Rain Fade Modal */}
      {showWeatherModal && <AtmosphericTelemetryModal onClose={() => setShowWeatherModal(false)} />}

      {/* 10. 3D Radiometry Campus Twin (PIP & Fullscreen Modal) */}
      {show3DTwin && (
        is3DTwinFullscreen ? (
          <div className="fixed inset-4 sm:inset-8 z-50 bg-slate-900/98 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <div>
                  <div className="text-sm font-extrabold text-white tracking-wide">
                    R.V.R. &amp; J.C. College of Engineering — 3D Digital Twin
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    5G Massive MIMO Electromagnetic Radiometry &amp; Interactive Cartography
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIs3DTwinFullscreen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Collapse to PIP"
                >
                  <span className="material-symbols-outlined text-[16px]">close_fullscreen</span>
                  <span>Collapse PIP</span>
                </button>
                <button
                  onClick={() => {
                    setShow3DTwin(false);
                    setIs3DTwinFullscreen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Close 3D View"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 relative w-full h-full">
              <Visualization3D
                isFullscreen={true}
                onToggleFullscreen={() => setIs3DTwinFullscreen(false)}
                onSelectBuilding={(bId) => {
                  const loc = CAMPUS_LOCATIONS.find((l) => l.id === bId);
                  if (loc) {
                    handleSelectLocation(loc);
                    setIs3DTwinFullscreen(false);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="absolute bottom-6 left-6 z-30 w-84 sm:w-96 h-64 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  3D Campus Twin
                </span>
                <span className="text-[10px] text-sky-400 font-mono">Interactive</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIs3DTwinFullscreen(true)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Expand Fullscreen 3D Twin"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                </button>
                <button
                  onClick={() => setShow3DTwin(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Close 3D View"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 relative w-full h-full">
              <Visualization3D
                isFullscreen={false}
                onToggleFullscreen={() => setIs3DTwinFullscreen(true)}
                onSelectBuilding={(bId) => {
                  const loc = CAMPUS_LOCATIONS.find((l) => l.id === bId);
                  if (loc) handleSelectLocation(loc);
                }}
              />
            </div>
          </div>
        )
      )}

      {/* 11. Slide-Over Place Detail Panel (Google Maps Left Sheet) */}
      {showPlaceDetail && selectedPlace && (
        <PlaceDetailPanel
          place={selectedPlace}
          onClose={() => setShowPlaceDetail(false)}
          onMeasureRequest={() => setShowMeasurementFlow(true)}
          onNavigateRequest={() => {
            if (selectedPlace) {
              setNavOriginId('gate-main');
              setNavDestId(selectedPlace.id === 'gate-main' ? 'cyber-001' : selectedPlace.id);
            }
            setShowNavigation(true);
            setShowPlaceDetail(false);
            setIsGlobalView(false);
            setNavFitTick((t) => t + 1);
          }}
          onSetAsOrigin={() => {
            if (selectedPlace) {
              setNavOriginId(selectedPlace.id);
            }
            setShowNavigation(true);
            setShowPlaceDetail(false);
            setIsGlobalView(false);
            setNavFitTick((t) => t + 1);
          }}
          onSetAsDestination={() => {
            if (selectedPlace) {
              setNavDestId(selectedPlace.id);
            }
            setShowNavigation(true);
            setShowPlaceDetail(false);
            setIsGlobalView(false);
            setNavFitTick((t) => t + 1);
          }}
        />
      )}

      {/* 12. Slide-Over Carrier Comparison Sheet */}
      {showCarrierPanel && (
        <CarrierPanel
          selectedPlace={selectedPlace}
          onClose={() => setShowCarrierPanel(false)}
        />
      )}

      {/* 13. Slide-Over Live Telemetry Sheet */}
      {showTelemetryPanel && (
        <div className="fixed top-4 left-4 z-40 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]">
          <TelemetryPanel onClose={() => setShowTelemetryPanel(false)} />
        </div>
      )}

      {/* 14. Interactive Speed Test Modal */}
      {showMeasurementFlow && (
        <MeasurementFlow
          onClose={() => setShowMeasurementFlow(false)}
          onPlaceSelect={(place) => {
            setSelectedPlace(place);
            setShowPlaceDetail(true);
            setShowMeasurementFlow(false);
          }}
        />
      )}

      {/* 15. AI Campus Assistant (Bottom-Right Chat) */}
      {showChatBot && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 shadow-2xl rounded-3xl overflow-hidden border border-slate-700/80 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <ChatBot
            onClose={() => setShowChatBot(false)}
            onPlaceSuggestion={(place) => {
              setSelectedPlace(place);
              setShowPlaceDetail(true);
              setShowChatBot(false);
            }}
          />
        </div>
      )}

      {/* 17. Full-Screen Admin Console */}
      {showAdminConsole && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <AdminConsole onClose={() => setShowAdminConsole(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
