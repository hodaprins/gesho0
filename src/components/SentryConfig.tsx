import { AlertTriangle, X, Activity, Bell, FileCode, Check } from 'lucide-react';
import { useState } from 'react';

export default function SentryConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [perfMonitor, setPerfMonitor] = useState(true);
  const [sessionReplay, setSessionReplay] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Sentry Configuration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><label className="text-xs text-slate-500 mb-1 block">DSN (Data Source Name)</label><input defaultValue="https://xxx@sentry.io/123" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 font-mono" /></div>
          <div className="space-y-2">
            <button onClick={() => setPerfMonitor(!perfMonitor)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-purple-400" /><span className="text-xs text-slate-200">Performance Monitoring</span></div><span className={`text-xs ${perfMonitor ? 'text-emerald-400' : 'text-slate-600'}`}>{perfMonitor ? 'ON' : 'OFF'}</span></button>
            <button onClick={() => setSessionReplay(!sessionReplay)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center gap-2"><FileCode className="w-3.5 h-3.5 text-purple-400" /><span className="text-xs text-slate-200">Session Replay</span></div><span className={`text-xs ${sessionReplay ? 'text-emerald-400' : 'text-slate-600'}`}>{sessionReplay ? 'ON' : 'OFF'}</span></button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-purple-400 font-medium mb-2 flex items-center gap-1.5"><Bell className="w-3 h-3" /> Alert Rules</h4><div className="space-y-1.5">{[{ t: 'Error rate > 1%', on: true }, { t: 'New error introduced', on: true }, { t: 'Performance regression', on: true }, { t: 'Release health check', on: false }].map(r => <div key={r.t} className="flex items-center gap-2 text-xs"><div className={`w-3 h-3 rounded ${r.on ? 'bg-purple-400' : 'bg-slate-700'}`} /><span className={r.on ? 'text-slate-300' : 'text-slate-500'}>{r.t}</span></div>)}</div></div>
          <div className="grid grid-cols-3 gap-2"><div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-sm font-bold text-red-400">23</p><p className="text-[10px] text-slate-500">Errors (24h)</p></div><div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-sm font-bold text-amber-400">156ms</p><p className="text-[10px] text-slate-500">Avg P50</p></div><div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-sm font-bold text-emerald-400">99.2%</p><p className="text-[10px] text-slate-500">Crash-free</p></div></div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /><span className="text-xs text-slate-300">Source maps uploaded automatically on each release</span></div>
        </div>
      </div>
    </div>
  );
}
