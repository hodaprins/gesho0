import { RefreshCw, X, Check, AlertTriangle, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function OTAUpdateManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [channel, setChannel] = useState<'staging' | 'production'>('staging');
  const [rollout, setRollout] = useState(25);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">OTA Update Manager</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex items-center gap-1.5">{(['staging', 'production'] as const).map(c => <button key={c} onClick={() => setChannel(c)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${channel === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{c}</button>)}</div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-2"><div><p className="text-sm font-medium text-slate-200">Update v2.3.1</p><p className="text-[10px] text-slate-500">Bundle: 234 KB · JS only</p></div><Check className="w-5 h-5 text-emerald-400" /></div>
            <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-slate-500">Changes:</span><span className="text-slate-300">Bug fixes, performance improvements</span></div>
          </div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Rollout Percentage</label><span className="text-xs font-mono text-slate-200">{rollout}%</span></div><input type="range" min="1" max="100" value={rollout} onChange={(e) => setRollout(Number(e.target.value))} className="w-full accent-emerald-500" /><div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>1% (canary)</span><span>100% (full)</span></div></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">12.5K</p><p className="text-[10px] text-slate-500">Active Users</p></div>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-sm font-bold text-emerald-400">{Math.round(12500 * rollout / 100)}</p><p className="text-[10px] text-slate-500">Receiving Update</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">99.2%</p><p className="text-[10px] text-slate-500">Success Rate</p></div>
          </div>
          <div className="flex items-center gap-2"><button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium"><RefreshCw className="w-3.5 h-3.5" /> Publish Update</button><button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium"><RotateCcw className="w-3.5 h-3.5" /> Rollback</button></div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /><p className="text-[10px] text-slate-400">OTA updates cannot change native code. Use for JS/asset updates only.</p></div>
        </div>
      </div>
    </div>
  );
}
