import { useState } from 'react';

export interface FloorInfo {
  level: number;
  label: string;
  apCount: number;
  signalStrength: string;
  avgSpeed: string;
}

export interface RoomBlueprint {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: string;
  signal: string;
  clients: number;
  status: 'optimal' | 'good' | 'fair';
}

interface FloorSelectorProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  buildingName: string;
  onClose: () => void;
}

export const FloorSelector = ({
  currentFloor,
  onFloorChange,
  buildingName,
  onClose
}: FloorSelectorProps) => {
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomBlueprint | null>(null);

  const floors: FloorInfo[] = [
    { level: 3, label: '3F', apCount: 4, signalStrength: '-52 dBm', avgSpeed: '1.1 Gbps' },
    { level: 2, label: '2F', apCount: 6, signalStrength: '-48 dBm', avgSpeed: '1.2 Gbps' },
    { level: 1, label: '1F', apCount: 5, signalStrength: '-56 dBm', avgSpeed: '840 Mbps' },
    { level: 0, label: 'GF', apCount: 6, signalStrength: '-60 dBm', avgSpeed: '780 Mbps' }
  ];

  const activeFloorData = floors.find((f) => f.level === currentFloor) || floors[3];

  // Architectural rooms per floor
  const floorRooms: Record<number, RoomBlueprint[]> = {
    3: [
      { id: 'r301', name: 'Postgrad Research Lab', code: 'Lab 301', x: 20, y: 20, w: 110, h: 60, speed: '1.1 Gbps', signal: '-52 dBm', clients: 18, status: 'optimal' },
      { id: 'r302', name: 'IoT & Embedded Systems', code: 'Lab 302', x: 140, y: 20, w: 110, h: 60, speed: '1.2 Gbps', signal: '-49 dBm', clients: 24, status: 'optimal' },
      { id: 'r303', name: 'Conference Seminar Hall', code: 'Hall 303', x: 260, y: 20, w: 100, h: 100, speed: '980 Mbps', signal: '-56 dBm', clients: 45, status: 'good' },
      { id: 'r304', name: 'Department Library Archive', code: 'Lib 304', x: 20, y: 90, w: 110, h: 60, speed: '890 Mbps', signal: '-58 dBm', clients: 12, status: 'good' },
      { id: 'r305', name: 'Faculty Research Cubicles', code: 'Cabins', x: 140, y: 90, w: 110, h: 60, speed: '1.0 Gbps', signal: '-54 dBm', clients: 8, status: 'optimal' }
    ],
    2: [
      { id: 'r201', name: 'AI & Deep Learning Center', code: 'Lab 201', x: 20, y: 20, w: 110, h: 60, speed: '1.4 Gbps', signal: '-42 dBm', clients: 32, status: 'optimal' },
      { id: 'r202', name: 'Data Science Hub', code: 'Lab 202', x: 140, y: 20, w: 110, h: 60, speed: '1.2 Gbps', signal: '-48 dBm', clients: 28, status: 'optimal' },
      { id: 'r203', name: 'Server & Optical Telemetry Room', code: 'NOC 203', x: 260, y: 20, w: 100, h: 60, speed: '1.8 Gbps', signal: '-38 dBm', clients: 6, status: 'optimal' },
      { id: 'r204', name: 'Cloud Computing Infrastructure', code: 'Lab 204', x: 20, y: 90, w: 110, h: 60, speed: '1.1 Gbps', signal: '-52 dBm', clients: 22, status: 'optimal' },
      { id: 'r205', name: 'Advanced Coding Pavilion', code: 'Lab 205', x: 140, y: 90, w: 220, h: 60, speed: '1.3 Gbps', signal: '-46 dBm', clients: 40, status: 'optimal' }
    ],
    1: [
      { id: 'r101', name: 'Cisco Networking Academy', code: 'Lab 101', x: 20, y: 20, w: 120, h: 60, speed: '940 Mbps', signal: '-54 dBm', clients: 30, status: 'good' },
      { id: 'r102', name: 'Operating Systems & Linux Lab', code: 'Lab 102', x: 150, y: 20, w: 110, h: 60, speed: '860 Mbps', signal: '-58 dBm', clients: 26, status: 'good' },
      { id: 'r103', name: 'Head of Department Suite', code: 'HOD Office', x: 270, y: 20, w: 90, h: 60, speed: '1.0 Gbps', signal: '-50 dBm', clients: 4, status: 'optimal' },
      { id: 'r104', name: 'Hardware Testing & Microprocessor Bay', code: 'Lab 104', x: 20, y: 90, w: 180, h: 60, speed: '780 Mbps', signal: '-62 dBm', clients: 35, status: 'fair' },
      { id: 'r105', name: 'Department Staff Lounge', code: 'Lounge', x: 210, y: 90, w: 150, h: 60, speed: '820 Mbps', signal: '-60 dBm', clients: 14, status: 'good' }
    ],
    0: [
      { id: 'r001', name: 'Central Entrance Foyer & Concourse', code: 'Atrium', x: 20, y: 20, w: 150, h: 130, speed: '880 Mbps', signal: '-56 dBm', clients: 65, status: 'good' },
      { id: 'r002', name: 'Placement & Industry Liaison Cell', code: 'Training', x: 180, y: 20, w: 180, h: 60, speed: '760 Mbps', signal: '-62 dBm', clients: 20, status: 'fair' },
      { id: 'r003', name: 'Student Common Lounge & Helpdesk', code: 'Helpdesk', x: 180, y: 90, w: 180, h: 60, speed: '810 Mbps', signal: '-59 dBm', clients: 28, status: 'good' }
    ]
  };

  const currentRooms = floorRooms[currentFloor] || floorRooms[2];

  return (
    <>
      {/* Compact Floating Elevator Bar */}
      <div className="absolute right-4 top-24 z-30 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-3 shadow-2xl flex flex-col items-center gap-2 min-w-36">
          <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-1.5 text-left min-w-0">
              <span className="material-symbols-outlined text-[16px] text-sky-400 shrink-0">apartment</span>
              <div className="truncate">
                <div className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                  {buildingName}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Floor Nav</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
              title="Close Floor Selector"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          </div>

          {/* Vertical Elevator Button Stack */}
          <div className="flex flex-col gap-1.5 w-full">
            {floors.map((f) => {
              const isSelected = f.level === currentFloor;
              return (
                <button
                  key={f.level}
                  onClick={() => onFloorChange(f.level)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span className="font-mono">{f.label}</span>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                    {f.apCount} APs
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Floor Metrics Pill */}
          <div className="w-full pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-400 text-center">
            <div className="text-white font-bold">{activeFloorData.avgSpeed}</div>
            <div className="text-emerald-400">{activeFloorData.signalStrength}</div>
          </div>

          {/* Button to Open Full Architectural Blueprint */}
          <button
            onClick={() => setShowBlueprintModal(true)}
            className="w-full py-1.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">map</span>
            <span>View Blueprint</span>
          </button>
        </div>
      </div>

      {/* Full Architectural Indoor Blueprint Modal */}
      {showBlueprintModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowBlueprintModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                  <span className="material-symbols-outlined text-[18px]">architecture</span>
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {buildingName} — Floor {currentFloor} Plan
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Indoor Wi-Fi 6E &amp; 5G Microcell Cartography • {activeFloorData.apCount} Access Points Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Floor Switcher Buttons Row inside Modal */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/50 border-b border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Floor Level:</span>
              <div className="flex gap-1.5">
                {floors.map((f) => (
                  <button
                    key={f.level}
                    onClick={() => {
                      onFloorChange(f.level);
                      setSelectedRoom(null);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      currentFloor === f.level
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blueprint SVG Canvas */}
            <div className="p-6 bg-slate-950/60 flex flex-col items-center">
              <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                  <span>NORTH WING (CAMPUS PLAZA)</span>
                  <span>CAD BLUEPRINT SCALE 1:100</span>
                </div>

                <svg viewBox="0 0 380 170" className="w-full h-auto drop-shadow-lg">
                  {/* Outer Building Wall Shell */}
                  <rect x="10" y="10" width="360" height="150" fill="#090d16" stroke="#334155" strokeWidth="3" rx="8" />

                  {/* Rooms */}
                  {currentRooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    return (
                      <g
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className="cursor-pointer group"
                      >
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          fill={isSelected ? '#0284c7' : room.status === 'optimal' ? '#064e3b' : '#1e293b'}
                          fillOpacity={isSelected ? '0.45' : '0.35'}
                          stroke={isSelected ? '#38bdf8' : room.status === 'optimal' ? '#10b981' : '#475569'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          rx="4"
                          className="transition-all duration-150 group-hover:fill-opacity-60"
                        />
                        <text
                          x={room.x + 8}
                          y={room.y + 18}
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {room.code}
                        </text>
                        <text
                          x={room.x + 8}
                          y={room.y + 32}
                          fill="#94a3b8"
                          fontSize="7"
                          fontFamily="sans-serif"
                        >
                          {room.name.length > 20 ? room.name.substring(0, 18) + '...' : room.name}
                        </text>
                        <text
                          x={room.x + 8}
                          y={room.y + 46}
                          fill={room.status === 'optimal' ? '#34d399' : '#38bdf8'}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {room.speed}
                        </text>

                        {/* Wi-Fi 6E Microcell Access Point Icon inside room */}
                        <circle cx={room.x + room.w - 12} cy={room.y + 14} r="4" fill="#38bdf8" />
                        <circle cx={room.x + room.w - 12} cy={room.y + 14} r="7" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" className="animate-ping" />
                      </g>
                    );
                  })}
                </svg>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                  <span>CORRIDOR CONCOURSE</span>
                  <span>SOUTH FOYER</span>
                </div>
              </div>

              {/* Selected Room Telemetry Card */}
              {selectedRoom ? (
                <div className="mt-4 w-full p-3.5 rounded-2xl bg-slate-800/80 border border-sky-400/50 flex items-center justify-between animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{selectedRoom.code} — {selectedRoom.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                        {selectedRoom.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Throughput: <span className="text-sky-400 font-bold">{selectedRoom.speed}</span> • RSSI: <span className="text-emerald-400 font-bold">{selectedRoom.signal}</span> • Connected Clients: <span className="text-white">{selectedRoom.clients}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 block">Band</span>
                    <span className="text-xs font-mono font-bold text-sky-400">Wi-Fi 6E (160MHz)</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-center text-[10px] font-mono text-slate-400">
                  Click any room on the blueprint to view physical layer access point radiometry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
