import { ArrowLeftRight, X, Play } from 'lucide-react';
import { useState } from 'react';

export default function ViewTransitionsAPI({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState<'fade' | 'slide' | 'morph'>('fade');
  const [duration, setDuration] = useState(300);
  const [playing, setPlaying] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ArrowLeftRight className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">View Transitions API</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['fade', 'slide', 'morph'] as const).map(t => <button key={t} onClick={() => setType(t)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${type === t ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{t}</button>)}
            <div className="flex-1" />
            <button onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), duration + 100); }} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400"><Play className="w-3 h-3" /> Preview</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs h-40 rounded-2xl bg-slate-950/50 border border-slate-800 overflow-hidden">
              <div className={`absolute inset-0 flex items-center justify-center transition-all ${playing ? 'duration-300' : ''}`} style={{ animationName: playing ? `vt-${type}` : 'none', animationDuration: `${duration}ms`, animationTimingFunction: 'ease-in-out' }}>
                <div className="rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 p-4 text-center"><p className="text-sm text-white">Page A</p></div>
              </div>
              {playing && <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-xl bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 p-4 text-center animate-fade-in"><p className="text-sm text-white">Page B</p></div></div>}
            </div>
          </div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Duration</label><span className="text-xs font-mono text-slate-200">{duration}ms</span></div><input type="range" min="100" max="1000" step="50" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-purple-400 font-medium mb-1">CSS Code</h4>
            <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`::view-transition-old(root) {\n  animation: ${type} ${duration}ms ease;\n}\n::view-transition-new(root) {\n  animation: ${type} ${duration}ms ease;\n}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
