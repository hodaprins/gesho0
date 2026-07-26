import { LayoutGrid, X, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const SIZES = ['1x1', '2x1', '2x2', '4x1', '4x2', '4x4'];

export default function AndroidWidgetBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [size, setSize] = useState('2x2');
  const [interval, setInterval] = useState(30);
  if (!open) return null;
  const [cols, rows] = size.split('x').map(Number);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-green-400" /><h3 className="text-sm font-semibold text-slate-100">Android Widget Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Widget Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(s => <button key={s} onClick={() => setSize(s)} className={`rounded-lg p-2 text-xs font-mono transition-colors ${size === s ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-800'}`}>{s}</button>)}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-slate-950/50 p-4" style={{ width: `${cols * 70 + 40}px`, minHeight: `${rows * 70 + 20}px` }}>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-3" style={{ width: `${cols * 70}px`, minHeight: `${rows * 70}px` }}>
                <div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-lg bg-green-500/30" /><span className="text-xs font-medium text-slate-200">My Widget</span></div>
                <div className="space-y-1.5">{Array.from({ length: rows * 2 }).map((_, i) => <div key={i} className="h-2 bg-slate-700 rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />)}</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><div className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-green-400" /><span className="text-xs text-slate-300">Update Interval</span></div><span className="text-xs font-mono text-slate-200">{interval} min</span></div>
            <input type="range" min="5" max="240" step="5" value={interval} onChange={(e) => setInterval(Number(e.target.value))} className="w-full accent-green-500" />
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><p className="text-xs text-slate-500">Configuration Activity</p><code className="text-[10px] font-mono text-green-400">android:configure="com.app.WidgetConfigActivity"</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
