import { Activity, X, TrendingUp, AlertTriangle, Check } from 'lucide-react';

const METRICS = [
  { name: 'LCP', value: 1.8, unit: 's', target: 2.5, status: 'good', desc: 'Largest Contentful Paint' },
  { name: 'INP', value: 180, unit: 'ms', target: 200, status: 'good', desc: 'Interaction to Next Paint' },
  { name: 'CLS', value: 0.08, unit: '', target: 0.1, status: 'good', desc: 'Cumulative Layout Shift' },
  { name: 'TTFB', value: 420, unit: 'ms', target: 800, status: 'good', desc: 'Time to First Byte' },
  { name: 'FCP', value: 0.9, unit: 's', target: 1.8, status: 'good', desc: 'First Contentful Paint' },
  { name: 'TBT', value: 120, unit: 'ms', target: 200, status: 'good', desc: 'Total Blocking Time' },
];

const ROUTES = [
  { path: '/', lcp: 1.2, cls: 0.05, inp: 150 }, { path: '/dashboard', lcp: 2.1, cls: 0.12, inp: 220 },
  { path: '/profile', lcp: 0.8, cls: 0.02, inp: 90 }, { path: '/settings', lcp: 1.5, cls: 0.08, inp: 180 },
];

export default function WebVitalsMonitor({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const avgScore = Math.round(METRICS.filter(m => m.status === 'good').length / METRICS.length * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Core Web Vitals</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-3 border-b border-slate-800"><div className="flex items-center gap-3"><div className="relative w-16 h-16"><svg className="w-full h-full -rotate-90"><circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="4" /><circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${(avgScore / 100) * 175.9} 175.9`} strokeLinecap="round" /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold text-emerald-400">{avgScore}</span></div></div><div><p className="text-sm font-medium text-slate-200">Performance Score</p><p className="text-xs text-slate-500">All metrics passing Core Web Vitals thresholds</p></div></div></div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">{METRICS.map(m => (<div key={m.name} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-slate-200">{m.name}</span><Check className="w-3 h-3 text-emerald-400" /></div><p className="text-lg font-bold text-emerald-400">{m.value}{m.unit}</p><p className="text-[9px] text-slate-500">Target: &lt;{m.target}{m.unit}</p></div>))}</div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Per-Route Breakdown</h4><div className="space-y-1.5">{ROUTES.map(r => (<div key={r.path} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><code className="text-xs text-slate-300 font-mono flex-1">{r.path}</code><span className={`text-xs font-mono ${r.lcp > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{r.lcp}s</span><span className={`text-xs font-mono ${r.cls > 0.1 ? 'text-red-400' : 'text-emerald-400'}`}>{r.cls}</span><span className={`text-xs font-mono ${r.inp > 200 ? 'text-amber-400' : 'text-emerald-400'}`}>{r.inp}ms</span></div>))}</div><div className="flex justify-end gap-3 text-[9px] text-slate-500 mt-1"><span>LCP</span><span>CLS</span><span>INP</span></div></div>
        </div>
      </div>
    </div>
  );
}
