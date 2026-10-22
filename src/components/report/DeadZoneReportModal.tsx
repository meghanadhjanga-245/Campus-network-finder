import { useState } from 'react';

interface DeadZoneReportModalProps {
  onClose: () => void;
  selectedLocationName?: string;
}

export const DeadZoneReportModal = ({
  onClose,
  selectedLocationName = 'Central Campus Perimeter'
}: DeadZoneReportModalProps) => {
  const [issueType, setIssueType] = useState('call_drop');
  const [carrier, setCarrier] = useState('Jio True 5G');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = [
    { id: 'call_drop', label: 'Call Dropped', icon: 'phone_missed', desc: 'Active voice call terminated abruptly' },
    { id: 'zero_signal', label: 'No 5G Coverage', icon: 'signal_cellular_off', desc: 'Fell back to 2G/EDGE or No Service' },
    { id: 'high_latency', label: 'Extreme Buffering', icon: 'hourglass_empty', desc: 'Video calls freezing, >200ms latency' },
    { id: 'indoor_loss', label: 'Indoor Dead Zone', icon: 'domain_disabled', desc: 'Good outdoor signal, zero indoor penetration' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
              <span className="material-symbols-outlined text-[18px]">report_problem</span>
            </span>
            <div>
              <h3 className="font-bold text-sm text-white">Report Signal Dead-Zone</h3>
              <p className="text-[10px] text-slate-400 font-mono">Crowdsourced RF Anomaly Logger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Incident Logged!</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Your report has been synced to the RVRJC Network Operations Admin Moderation queue with GPS coordinates.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Tagged Location */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block font-mono">
                Flagged Location
              </span>
              <div className="text-xs font-bold text-white mt-0.5">{selectedLocationName}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Coordinates: [80.3228° E, 16.2538° N] • RVRJC Campus
              </div>
            </div>

            {/* Issue Category Radio Cards */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Issue Encountered:</label>
              <div className="grid grid-cols-2 gap-2">
                {issueTypes.map((t) => {
                  const isSelected = issueType === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setIssueType(t.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-400 shadow-md'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] mb-1 block ${isSelected ? 'text-rose-400' : 'text-slate-400'}`}>
                        {t.icon}
                      </span>
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">{t.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carrier Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Affected Carrier:</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="Jio True 5G">Jio True 5G (SA n78)</option>
                <option value="Airtel 5G Plus">Airtel 5G Plus (NSA)</option>
                <option value="Campus Wi-Fi 6E">Campus Wi-Fi 6E (RVRJC-Student)</option>
                <option value="Vodafone Idea (Vi)">Vodafone Idea 4G VoLTE</option>
              </select>
            </div>

            {/* Description note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Details (Optional):</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Signal drops specifically near Room 302 north-facing window..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400 resize-none h-16 placeholder-slate-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-rose-500/20"
              >
                {isSubmitting ? 'Transmitting to Admin...' : 'Submit Incident Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
