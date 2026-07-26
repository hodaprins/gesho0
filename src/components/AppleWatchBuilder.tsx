import { Watch, X, Circle, Bell } from 'lucide-react';
import { useState } from 'react';

export default function AppleWatchBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<'app' | 'complication' | 'notification'>('app');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Watch className="w-5 h-5 text-rose-400" /><h3 className="text-sm font-semibold text-slate-100">Apple Watch Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['app', 'complication', 'notification'] as const).map(v => <button key={v} onClick={() => setView(v)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${view === v ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{v}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col items-center">
          <div className="relative w-44 h-44 rounded-full border-[5px] border-slate-700 bg-black overflow-hidden">
            <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
            {view === 'app' && <div className="flex items-center justify-center h-full flex-col"><div className="w-10 h-10 rounded-xl bg-rose-500/30 mb-1" /><p className="text-[10px] text-white">Watch App</p><div className="mt-2 space-y-1">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1.5 bg-slate-700 rounded" style={{ width: `${40 + i * 10}px` }} />)}</div></div>}
            {view === 'complication' && <div className="flex items-center justify-center h-full"><div className="text-center"><p className="text-2xl font-bold text-rose-400">42</p><p className="text-[8px] text-slate-400">BPM</p></div></div>}
            {view === 'notification' && <div className="p-3 h-full"><div className="flex items-center gap-1.5 mb-2"><Bell className="w-3 h-3 text-rose-400" /><span className="text-[8px] text-white">Notification</span></div><div className="space-y-1">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1.5 bg-slate-700 rounded" />)}</div><div className="mt-2 h-5 rounded bg-rose-500/30" /></div>}
          </div>
          <div className="mt-4 w-full space-y-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-rose-400 font-medium mb-1">Complication Families</h4><div className="flex flex-wrap gap-1">{['circularSmall', 'extraLarge', 'graphicBezel', 'graphicCircular', 'graphicCorner', 'graphicRectangular', 'modularLarge', 'modularSmall', 'utilitarianLarge', 'utilitarianSmall'].map(f => <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f}</span>)}</div></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><p className="text-xs text-slate-400">SwiftUI WatchKit</p><code className="text-[10px] font-mono text-slate-500">TabView {'{ NavigationStack { ... } }'}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
