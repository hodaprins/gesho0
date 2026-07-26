import { Boxes, X, ArrowRight, Share2 } from 'lucide-react';
import { useState } from 'react';

const REMOTES = [
  { name: 'auth-app', entry: 'http://localhost:3001/remoteEntry.js', exposes: ['./LoginModal'] },
  { name: 'dashboard-app', entry: 'http://localhost:3002/remoteEntry.js', exposes: ['./Dashboard'] },
  { name: 'settings-app', entry: 'http://localhost:3003/remoteEntry.js', exposes: ['./Settings'] },
];

export default function ModuleFederationConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Boxes className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Module Federation</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center mb-2"><svg viewBox="0 0 300 120" className="w-full max-w-sm"><rect x="120" y="10" width="60" height="25" rx="6" fill="#0e7490" /><text x="150" y="27" textAnchor="middle" fill="white" fontSize="10">Host App</text>{REMOTES.map((r, i) => { const x = 20 + i * 100; const y = 75; return <g key={r.name}><line x1="150" y1="35" x2={x + 30} y2={y} stroke="#475569" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#mf-arrow)" /><rect x={x} y={y} width="60" height="25" rx="6" fill="#1e293b" stroke="#0e7490" /><text x={x + 30} y={y + 16} textAnchor="middle" fill="#67e8f9" fontSize="8">{r.name}</text></g>; })}<defs><marker id="mf-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#475569" /></marker></defs></svg></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Remote Modules</h4><div className="space-y-1.5">{REMOTES.map(r => <div key={r.name} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center gap-2"><Share2 className="w-3.5 h-3.5 text-cyan-400" /><span className="text-xs text-slate-200">{r.name}</span></div><code className="text-[10px] font-mono text-slate-500 block mt-1">{r.entry}</code><div className="flex gap-1 mt-1">{r.exposes.map(e => <span key={e} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">{e}</span>)}</div></div>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-cyan-400 font-medium mb-1">Shared Dependencies</h4><div className="flex flex-wrap gap-1">{['react', 'react-dom', 'zustand', 'tailwindcss'].map(d => <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{d} (singleton)</span>)}</div></div>
        </div>
      </div>
    </div>
  );
}
