import { Square, X } from 'lucide-react';
import { useState } from 'react';

export default function ContainerQueriesBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [width, setWidth] = useState(400);
  if (!open) return null;

  const bp = width < 200 ? 'small' : width < 400 ? 'medium' : 'large';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Square className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Container Queries</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Container Width</label><span className="text-xs font-mono text-slate-200">{width}px → <span className="text-emerald-400">{bp}</span></span></div><input type="range" min="100" max="800" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
          <div className="flex justify-center">
            <div className="rounded-xl border-2 border-dashed border-slate-700 p-4 transition-all" style={{ width: `${width}px` }}>
              <div className={`rounded-lg p-3 transition-all ${bp === 'small' ? 'flex-col space-y-1' : bp === 'medium' ? 'flex-row gap-2' : 'grid grid-cols-3 gap-2'}`}>
                {Array.from({ length: bp === 'small' ? 1 : bp === 'medium' ? 2 : 3 }).map((_, i) => <div key={i} className="rounded-lg bg-emerald-500/20 p-2 text-center"><span className="text-[10px] text-emerald-400">Item {i + 1}</span></div>)}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-emerald-400 font-medium mb-1">Generated CSS</h4>
            <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`.card {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (max-width: 200px) {\n  .layout { flex-direction: column; }\n}\n@container card (min-width: 400px) {\n  .layout { display: grid; grid-cols: 3; }\n}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
