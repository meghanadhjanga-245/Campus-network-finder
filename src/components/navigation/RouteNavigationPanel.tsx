import { useMemo, useState, useEffect } from 'react';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { calculateDynamicRoute } from '../../data/navigationRoutes';
import { soundFX } from '../../utils/soundEffects';

interface RouteNavigationPanelProps {
  onClose: () => void;
  originId: string;
  destinationId: string;
  onOriginChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  selectedRouteId: 'shortest' | 'optimal-5g';
  onSelectRoute: (routeId: 'shortest' | 'optimal-5g') => void;
  onCenterPath?: () => void;
}

export const RouteNavigationPanel = ({
  onClose,
  originId,
  destinationId,
  onOriginChange,
  onDestinationChange,
  selectedRouteId,
  onSelectRoute,
  onCenterPath
}: RouteNavigationPanelProps) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Pure declarative calculations for both routes
  const optimalRoute = useMemo(() => {
    return calculateDynamicRoute(originId, destinationId, 'optimal-5g');
  }, [originId, destinationId]);

  const shortestRoute = useMemo(() => {
    return calculateDynamicRoute(originId, destinationId, 'shortest');
  }, [originId, destinationId]);

  const activeRoute = selectedRouteId === 'shortest' ? shortestRoute : optimalRoute;

  const originLocation = CAMPUS_LOCATIONS.find((l) => l.id === originId) || CAMPUS_LOCATIONS[4];
  const destLocation = CAMPUS_LOCATIONS.find((l) => l.id === destinationId) || CAMPUS_LOCATIONS[0];

  const handleSwap = () => {
    soundFX.playClick();
    const prevOrigin = originId;
    onOriginChange(destinationId);
    onDestinationChange(prevOrigin);
    setSimProgress(0);
    setIsSimulating(false);
  };

  // Simulation timer for "Simulate Walk / Transmit"
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          setIsSimulating(false);
          soundFX.playFanfare();
          return 100;
        }
        return prev + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleSimulation = () => {
    soundFX.playClick();
    if (simProgress >= 100) {
      setSimProgress(0);
    }
    setIsSimulating(!isSimulating);
  };

  const resetSimulation = () => {
    soundFX.playClick();
    setIsSimulating(false);
    setSimProgress(0);
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-4 left-4 z-40 w-auto max-w-[calc(100vw-2rem)] bg-slate-950/95 backdrop-blur-2xl border border-sky-500/40 rounded-2xl shadow-2xl p-2.5 flex items-center gap-2 animate-in fade-in duration-150">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate max-w-[170px] sm:max-w-[260px]">
          <span className="text-emerald-400 truncate">{originLocation.shortName}</span>
          <span className="material-symbols-outlined text-[13px] text-sky-400 shrink-0">arrow_forward</span>
          <span className="text-sky-300 truncate">{destLocation.shortName}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0">
          {activeRoute.distance}
        </span>
        <button
          onClick={() => {
            soundFX.playClick();
            setIsCollapsed(false);
          }}
          className="p-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs flex items-center justify-center cursor-pointer shrink-0"
          title="Expand Route Engine"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_full</span>
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
          title="Close Navigation"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-40 w-[420px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Top GIS Path Breadcrumb Bar */}
      <div className="px-3.5 py-2 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <span className="text-emerald-400 font-bold">RVRJC.GIS</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-200 font-medium truncate">
            {originLocation.shortName} Block ➔ {destLocation.shortName} Block
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">EPSG:4326</span>
          <button
            onClick={() => {
              soundFX.playClick();
              setIsCollapsed(true);
            }}
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Minimize Panel"
          >
            <span className="material-symbols-outlined text-[14px]">unfold_less</span>
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Panel"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      </div>

      {/* Campus Route Engine Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-sky-400">alt_route</span>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">
              Campus Route Engine
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
            A* Pathfinding
          </span>
        </div>

        {/* Origin & Destination Dropdown Selectors with Swap */}
        <div className="relative space-y-1.5 font-sans">
          {/* FROM selector */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 ring-4 ring-sky-500/20"></span>
            <span className="text-[10px] font-mono text-slate-400 uppercase w-10 shrink-0 font-bold">FROM</span>
            <select
              value={originId}
              onChange={(e) => {
                soundFX.playClick();
                onOriginChange(e.target.value);
                setSimProgress(0);
                setIsSimulating(false);
              }}
              className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  {loc.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button Floating to the right */}
          <button
            onClick={handleSwap}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:rotate-180"
            title="Swap Origin and Destination"
          >
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
          </button>

          {/* TO selector */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-4 ring-emerald-500/20"></span>
            <span className="text-[10px] font-mono text-slate-400 uppercase w-10 shrink-0 font-bold">TO</span>
            <select
              value={destinationId}
              onChange={(e) => {
                soundFX.playClick();
                onDestinationChange(e.target.value);
                setSimProgress(0);
                setIsSimulating(false);
              }}
              className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  {loc.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4-Tile Metrics Row Matching Screenshot */}
        <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block uppercase">Distance</span>
            <span className="text-xs font-black text-white">{activeRoute.distance}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block uppercase">Walk Time</span>
            <span className="text-xs font-black text-white">{activeRoute.duration}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block uppercase">Steps</span>
            <span className="text-xs font-black text-white">{activeRoute.stepsCount || 213}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block uppercase">5G Signal</span>
            <span className="text-xs font-black text-emerald-400">{activeRoute.coveragePct}% High</span>
          </div>
        </div>

        {/* Simulation Controls: [▶ Simulate Walk] [↻] [0% Completed] */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={toggleSimulation}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSimulating ? 'pause' : 'play_arrow'}
            </span>
            <span>{isSimulating ? 'Pause' : 'Simulate Walk'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Reset simulation"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>

          <div className="flex-1 flex items-center justify-end font-mono text-[11px] text-slate-400">
            <span className={simProgress > 0 ? 'text-sky-400 font-bold' : ''}>
              {simProgress}% Completed
            </span>
          </div>
        </div>

        {/* Live Simulation Progress Track Bar */}
        {simProgress > 0 && (
          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-150"
              style={{ width: `${simProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Instruction Banner Matching Screenshot */}
      <div className="p-3 bg-slate-950 border-b border-slate-800/80 flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
          <span className="material-symbols-outlined text-[18px]">straight</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white leading-snug">
            {activeRoute.steps[0]?.instruction || 'Proceed along quadrangle walkway toward destination'}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
            {activeRoute.steps[1]?.instruction || `Next waypoint: ${destLocation.displayName} in 64 meters`}
          </div>
        </div>
      </div>

      {/* Route Switcher Tabs: 5G Beam vs Shortest Path */}
      <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/60 flex gap-2">
        <button
          onClick={() => {
            soundFX.playClick();
            onSelectRoute('optimal-5g');
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedRouteId === 'optimal-5g'
              ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>5G Beam Path</span>
          <span className="font-mono text-[10px]">{optimalRoute.duration}</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onSelectRoute('shortest');
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedRouteId === 'shortest'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>Direct Walk</span>
          <span className="font-mono text-[10px]">{shortestRoute.duration}</span>
        </button>
      </div>

      {/* Detailed Waypoint Steps */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-48">
        {activeRoute.steps.map((step, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 flex items-start gap-2.5"
          >
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-sky-400 shrink-0 font-mono mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-white">{step.instruction}</span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{step.distance}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{step.signalDesc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Center Button */}
      {onCenterPath && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              soundFX.playClick();
              onCenterPath();
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-400">my_location</span>
            <span>Center Camera On Signal Corridor</span>
          </button>
        </div>
      )}
    </div>
  );
};
