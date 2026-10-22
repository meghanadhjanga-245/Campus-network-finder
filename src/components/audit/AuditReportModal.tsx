import { useState } from 'react';

interface AuditReportModalProps {
  onClose: () => void;
}

export const AuditReportModal = ({ onClose }: AuditReportModalProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const buildingsAudit = [
    { name: 'Library Block', coverage5G: '99.4%', meanRsrp: '-48 dBm', sinr: '+34.8 dB', loss: '0.02%', grade: 'A+' },
    { name: 'Cyber Block (CSE/IT)', coverage5G: '98.1%', meanRsrp: '-58 dBm', sinr: '+28.5 dB', loss: '0.05%', grade: 'A+' },
    { name: 'Administrative Block', coverage5G: '99.8%', meanRsrp: '-52 dBm', sinr: '+32.1 dB', loss: '0.01%', grade: 'A+' },
    { name: 'Student Centre / Canteen', coverage5G: '91.2%', meanRsrp: '-65 dBm', sinr: '+22.0 dB', loss: '0.12%', grade: 'A' },
    { name: 'Hostel A & B Complex', coverage5G: '94.6%', meanRsrp: '-62 dBm', sinr: '+24.8 dB', loss: '0.08%', grade: 'A' },
    { name: 'Athletics & Sports Ground', coverage5G: '88.3%', meanRsrp: '-68 dBm', sinr: '+19.4 dB', loss: '0.24%', grade: 'B+' },
    { name: 'Campus Gate & Entry Blvd', coverage5G: '92.5%', meanRsrp: '-66 dBm', sinr: '+21.5 dB', loss: '0.15%', grade: 'A-' }
  ];

  const handlePrint = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 600);
  };

  const handleDownloadJSON = () => {
    const reportData = {
      institution: 'R.V.R. & J.C. College of Engineering',
      title: '5G Massive MIMO Radiometry & Cartographic Audit Report',
      timestamp: new Date().toISOString(),
      standardsCompliance: '3GPP Release 17 / TRAI QoS Norms',
      meanCampusSpeed: '875 Mbps',
      overallCampusScore: '96.4 / 100',
      buildings: buildingsAudit
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RVRJC_5G_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = ['Building Name', '5G Coverage %', 'Mean RSRP (dBm)', 'SINR (dB)', 'Packet Loss %', 'Compliance Grade'];
    const rows = buildingsAudit.map((b) => [
      `"${b.name}"`,
      b.coverage5G.replace('%', ''),
      b.meanRsrp.replace(' dBm', ''),
      b.sinr.replace('+', '').replace(' dB', ''),
      b.loss.replace('%', ''),
      b.grade
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RVRJC_5G_Audit_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <div>
              <h3 className="font-bold text-sm text-white">Telecom RF Compliance & Audit</h3>
              <p className="text-[10px] text-slate-400 font-mono">3GPP Release 17 & TRAI Standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Printable Audit Document Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-sans">
          {/* Institutional Masthead */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest font-mono">
                Official Certification Document
              </span>
              <h4 className="text-base font-black text-white mt-0.5">
                R.V.R. &amp; J.C. College of Engineering
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Wireless Propagation &amp; Massive MIMO Network Audit • Academic Year 2026-27
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-2xl font-black text-emerald-400">96.4%</div>
              <span className="text-[9px] text-slate-400 uppercase">QoS Compliance</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Peak DL</span>
              <span className="text-sm font-bold text-sky-400">1,240 Mbps</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Median Latency</span>
              <span className="text-sm font-bold text-emerald-400">8.2 ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">Packet Loss</span>
              <span className="text-sm font-bold text-white">0.04%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block uppercase">MIMO Array Lock</span>
              <span className="text-sm font-bold text-purple-400">64T64R</span>
            </div>
          </div>

          {/* Detailed Building-by-Building Audit Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Facility-Specific Propagation Evaluation
            </div>
            <div className="rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="grid grid-cols-6 gap-2 p-2.5 bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span className="col-span-2">Campus Zone</span>
                <span>5G Coverage</span>
                <span>Mean RSRP</span>
                <span>SINR</span>
                <span className="text-right">Grade</span>
              </div>
              {buildingsAudit.map((b, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-6 gap-2 p-2.5 items-center border-t border-slate-800/60 ${
                    idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-800/20'
                  }`}
                >
                  <span className="col-span-2 font-sans font-semibold text-white truncate">{b.name}</span>
                  <span className="text-emerald-400 font-bold">{b.coverage5G}</span>
                  <span className="text-slate-300">{b.meanRsrp}</span>
                  <span className="text-sky-400">{b.sinr}</span>
                  <span className="text-right font-bold text-emerald-400">{b.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 shrink-0 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors cursor-pointer border border-emerald-500/30"
              title="Download CSV for Excel / MATLAB"
            >
              <span className="material-symbols-outlined text-[16px]">table_view</span>
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>JSON Data</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>{isExporting ? 'Preparing...' : 'Print / Save Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
