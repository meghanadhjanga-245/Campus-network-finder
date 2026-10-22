import { useState, useEffect } from 'react';
import { userAPI } from '../../api/user';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const [tab, setTab] = useState<'overview' | 'measurements' | 'saved' | 'privacy'>('overview');
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [measurementHistory, setMeasurementHistory] = useState<any[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = 'user-001';
        const profile = await userAPI.getUserProfile(userId);
        setUserData(profile);
        if (tab === 'measurements') {
          const history = await userAPI.getMeasurementHistory(userId);
          setMeasurementHistory(history);
        }
        if (tab === 'saved') {
          const places = await userAPI.getSavedPlaces(userId);
          setSavedPlaces(places);
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load user data');
        setUserData({
          displayName: 'Megha Janga',
          email: 'megha.janga@rvrjce.ac.in',
          role: 'Student Researcher',
          campus: 'R.V.R. & J.C. College of Engineering',
          memberSince: 'March 2024',
          lastLogin: 'Today, 10:30 AM'
        });
        if (tab === 'measurements') {
          setMeasurementHistory([
            {
              id: 'meas-001',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              location: 'Library Reading Room, Library Block',
              carrier: 'Jio True 5G',
              technology: '5G SA',
              download: 765,
              upload: 43,
              latency: 9.1,
              privacyLevel: 'aggregated'
            },
            {
              id: 'meas-002',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              location: 'Computer Lab 205, Cyber Block',
              carrier: 'Campus Wi-Fi 6E',
              technology: 'Wi-Fi 6E',
              download: 1250,
              upload: 125,
              latency: 1.7,
              privacyLevel: 'aggregated'
            },
            {
              id: 'meas-003',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              location: 'Hostel A Wing, Room 304',
              carrier: 'Airtel 5G Plus',
              technology: '5G NSA',
              download: 620,
              upload: 36,
              latency: 11.8,
              privacyLevel: 'aggregated'
            }
          ]);
        }
        if (tab === 'saved') {
          setSavedPlaces([
            {
              id: 'place-001',
              name: 'Library Reading Room',
              type: 'room',
              building: 'Library Block',
              floor: 2,
              campus: 'RVRJC College of Engineering',
              lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000)
            },
            {
              id: 'place-002',
              name: 'Computer Lab 205',
              type: 'room',
              building: 'Cyber Block',
              floor: 2,
              campus: 'RVRJC College of Engineering',
              lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000)
            },
            {
              id: 'place-003',
              name: 'Main Canteen Seating Area',
              type: 'outdoor_zone',
              building: 'Student Centre',
              floor: 'Ground',
              campus: 'RVRJC College of Engineering',
              lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [tab]);

  const handleTabChange = (newTab: typeof tab) => setTab(newTab);

  const handleConfirmDelete = () => {
    setLoading(true);
    userAPI
      .deleteAccount('user-001')
      .then(() => {
        alert('Account deletion requested.');
        onClose();
      })
      .catch(() => {
        alert('Failed to delete account.');
      })
      .finally(() => {
        setLoading(false);
        setShowDeleteAccount(false);
      });
  };

  return (
    <div className="w-84 sm:w-96 h-full bg-slate-900/98 backdrop-blur-2xl border-l border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-950/70 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-sky-500/20">
          MJ
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Student Profile</h3>
          <p className="text-[10px] text-slate-400 font-mono">R.V.R. &amp; J.C. College</p>
        </div>
        <button
          className="ml-auto w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-2 bg-slate-950/40 shrink-0">
        {[
          { id: 'overview', label: 'Account' },
          { id: 'measurements', label: 'History' },
          { id: 'saved', label: 'Saved' },
          { id: 'privacy', label: 'Privacy' }
        ].map((t) => (
          <button
            key={t.id}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === t.id
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleTabChange(t.id as any)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {tab === 'overview' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-800/80 to-slate-900 border border-sky-500/30">
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider font-mono block">
                Verified Identity
              </span>
              <div className="text-base font-bold text-white mt-0.5">
                {userData?.displayName || 'Megha Janga'}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {userData?.email || 'megha.janga@rvrjce.ac.in'}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold border border-sky-500/30">
                  {userData?.role || 'student'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Member since Mar 2024</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Campus:</span>
                <span className="text-white font-bold">{userData?.campus}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Active Node Lock:</span>
                <span className="text-emerald-400 font-bold">5G SA n78</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Benchmarks Run:</span>
                <span className="text-sky-400 font-bold">24 Tests</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Last Sign-In:</span>
                <span className="text-slate-300">{userData?.lastLogin}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'measurements' && (
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Recent Field Benchmarks ({measurementHistory.length})
            </div>
            {measurementHistory.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">
                    {m.location}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">
                    {m.carrier}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-center pt-1">
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase">Down</span>
                    <span className="text-xs font-bold text-sky-400">{m.download} M</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase">Up</span>
                    <span className="text-xs font-bold text-emerald-400">{m.upload} M</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase">Ping</span>
                    <span className="text-xs font-bold text-amber-400">{m.latency} ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'saved' && (
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Bookmarked Study Spots ({savedPlaces.length})
            </div>
            {savedPlaces.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {p.building} • Floor {p.floor}
                  </div>
                </div>
                <span className="material-symbols-outlined text-amber-400 text-[18px]">
                  bookmark_added
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Telemetry Anonymization
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All benchmark data points submitted by your device are anonymized and aggregated. MAC
                addresses, IMEIs, and personal browser traffic are strictly excluded from campus RF
                telemetry logs.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <span className="text-xs font-bold text-rose-300 block">Manage Account Data</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                You can purge your localized measurement cache or request account deregistrations at
                any time.
              </p>
              <button
                onClick={() => setShowDeleteAccount(true)}
                className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition-colors cursor-pointer"
              >
                Delete Account Cache
              </button>
            </div>

            {showDeleteAccount && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                <p className="text-xs text-slate-300">Are you sure you want to delete your profile data?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteAccount(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 py-1.5 rounded-lg bg-rose-500 text-xs text-white font-bold cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
