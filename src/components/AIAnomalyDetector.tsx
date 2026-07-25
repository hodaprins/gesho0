import { Activity, X, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Anomaly {
  id: string;
  metric: string;
  expected: number;
  actual: number;
  deviation: number;
  detected: string;
  severity: 'critical' | 'warning' | 'info';
  aiNote: string;
}

const ANOMALIES: Anomaly[] = [
  { id: '1', metric: 'API Error Rate', expected: 0.5, actual: 4.2, deviation: 740, detected: '2m ago', severity: 'critical', aiNote: 'Sudden spike in 500 errors from /api/orders endpoint. Likely a database connection issue.' },
  { id: '2', metric: 'Signup Conversion', expected: 12, actual: 3.2, deviation: -73, detected: '15m ago', severity: 'critical', aiNote: 'Conversion dropped 73%. The signup form may have a validation bug preventing submission.' },
  { id: '3', metric: 'Session Duration', expected: 180, actual: 45, deviation: -75, detected: '32m ago', severity: 'warning', aiNote: 'Sessions are 75% shorter than usual. Possible crash on the main screen.' },
  { id: '4', metric: 'Push Notification Open Rate', expected: 22, actual: 58, deviation: 164, detected: '1h ago', severity: 'info', aiNote: 'Unusually high open rate. A recent notification may have gone viral.' },
  { id: '5', metric: 'Database Query Time', expected: 50, actual: 380, deviation: 660, detected: '1h ago', severity: 'warning', aiNote: 'Queries 6.6x slower. Missing index on orders.user_id may be the cause.' },
  { id: '6', metric: 'Crash Rate', expected: 0.1, actual: 2.8, deviation: 2700, detected: '2h ago', severity: 'critical', aiNote: 'Crash rate 27x normal. iOS 17.2 devices affected. Memory leak in image loader suspected.' },
];

const SEV_META: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/5' },
  warning: { color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5' },
  info: { color: 'text-cyan-400', bg: 'border-cyan-500/30 bg-cyan-500/5' },
};

interface AIAnomalyDetectorProps {
  open: boolean;
  onClose: () => void;
}

export default function AIAnomalyDetector({ open, onClose }: AIAnomalyDetectorProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (open) { setScanning(true); setAnomalies([]); setTimeout(() => { setAnomalies(ANOMALIES); setScanning(false); }, 1200); }
  }, [open]);

  if (!open) return null;

  const critical = anomalies.filter((a) => a.severity === 'critical').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">AI Anomaly Detector</h3>{!scanning && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Live</span>}</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        {scanning ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="relative w-16 h-16"><div className="absolute inset-0 rounded-full border-2 border-purple-500/20" /><div className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /><Activity className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" /></div>
            <p className="text-xs text-slate-500">Scanning metrics for anomalies...</p>
            <p className="text-[10px] text-slate-600">Analyzing 47 metrics across 12 dimensions</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
              <div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-lg font-bold text-red-400">{critical}</p><p className="text-[10px] text-slate-500">Critical</p></div>
              <div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-lg font-bold text-amber-400">{anomalies.filter((a) => a.severity === 'warning').length}</p><p className="text-[10px] text-slate-500">Warnings</p></div>
              <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{anomalies.length}</p><p className="text-[10px] text-slate-500">Total</p></div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
              {anomalies.map((a) => (
                <div key={a.id} className={`rounded-xl border p-3 ${SEV_META[a.severity].bg}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-200">{a.metric}</span>
                    <span className={`text-xs font-mono font-bold ${a.deviation > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{a.deviation > 0 ? '+' : ''}{a.deviation}%</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2"><span>Expected: {a.expected}</span><span>Actual: <span className={SEV_META[a.severity].color}>{a.actual}</span></span><span>·</span><span>{a.detected}</span></div>
                  <div className="flex items-start gap-1.5 rounded-lg bg-slate-900/60 p-2"><Zap className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /><p className="text-[10px] text-slate-400">{a.aiNote}</p></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
