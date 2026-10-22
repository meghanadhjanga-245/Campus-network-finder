import { useState, useEffect } from 'react';

interface TimeSliderProps {
  onTimeChange: (hour: number) => void;
  onClose: () => void;
}

export const TimeSlider = ({ onTimeChange, onClose }: TimeSliderProps) => {
  const [currentHour, setCurrentHour] = useState(13); // Default 1:00 PM
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentHour((prev) => {
          const next = (prev + 1) % 24;
          onTimeChange(next);
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onTimeChange]);

  const handleSliderChange = (val: number) => {
    setCurrentHour(val);
    onTimeChange(val);
  };

  const getTrafficDetails = (hour: number) => {
    if (hour >= 8 && hour <= 10) {
      return { label: 'Class Arrival Peak', load: '84%', activeNode: 'Main Gate & Academic Blocks', color: 'text-amber-400' };
    }
    if (hour >= 12 && hour <= 14) {
      return { label: 'Lunch Congestion Surge', load: '96%', activeNode: 'Main Canteen & Student Centre', color: 'text-rose-400' };
    }
    if (hour >= 19 && hour <= 22) {
      return { label: 'Hostel Night Streaming', load: '92%', activeNode: 'Hostel A & B Wings', color: 'text-purple-400' };
    }
    if (hour >= 1 && hour <= 5) {
      return { label: 'Off-Peak Baseline', load: '12%', activeNode: 'Central Library Server Node', color: 'text-emerald-400' };
    }
    return { label: 'Normal Lab Hours', load: '58%', activeNode: 'Cyber & Library Blocks', color: 'text-sky-400' };
  };

  const traffic = getTrafficDetails(currentHour);
  const timeFormatted = `${String(currentHour).padStart(2, '0')}:00`;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-3">
        {/* Top Info Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
              title={isPlaying ? 'Pause' : 'Play 24h Simulation'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-white">{timeFormatted}</span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 ${traffic.color}`}>
                  {traffic.label}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                Congestion Hotspot: {traffic.activeNode}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[9px] text-slate-400 uppercase block">Grid Load</span>
              <span className={`text-sm font-bold ${traffic.color}`}>{traffic.load}</span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={currentHour}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1">
            <span>00:00 (Night)</span>
            <span>08:00 (Classes)</span>
            <span className="text-amber-400 font-bold">13:00 (Lunch)</span>
            <span>18:00 (Sports)</span>
            <span className="text-purple-400 font-bold">21:00 (Hostel)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
