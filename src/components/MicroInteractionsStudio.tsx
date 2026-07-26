import { Wand2, X, Play, Zap } from 'lucide-react';
import { useState } from 'react';

const PRESETS = [
  { id: 'ripple', name: 'Ripple', trigger: 'tap', desc: 'Material ripple on tap' },
  { id: 'bounce', name: 'Bounce In', trigger: 'appear', desc: 'Element bounces in' },
  { id: 'shake', name: 'Shake Error', trigger: 'error', desc: 'Horizontal shake on error' },
  { id: 'glow', name: 'Glow Pulse', trigger: 'hover', desc: 'Soft pulsing glow' },
  { id: 'lift', name: 'Card Lift', trigger: 'hover', desc: 'Card lifts with shadow' },
  { id: 'morph', name: 'Morph Button', trigger: 'tap', desc: 'Button → spinner' },
];

export default function MicroInteractionsStudio({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  if (!open) return null;
  const p = PRESETS[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Micro-Interactions Studio</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-44 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2 shrink-0">
            {PRESETS.map((preset, i) => <button key={preset.id} onClick={() => setSelected(i)} className={`w-full text-left px-3 py-2 transition-colors ${i === selected ? 'bg-slate-800' : 'hover:bg-slate-800/30'}`}><p className="text-xs text-slate-200">{preset.name}</p><p className="text-[9px] text-slate-500">{preset.trigger}</p></button>)}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            <div className="flex flex-col items-center justify-center py-8">
              <button onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), 800); }} className="relative">
                {p.id === 'ripple' && <div className={`w-20 h-20 rounded-full bg-purple-500/30 flex items-center justify-center ${playing ? 'animate-ping' : ''}`}><div className="w-12 h-12 rounded-full bg-purple-500" /></div>}
                {p.id === 'bounce' && <div className={`w-20 h-20 rounded-2xl bg-purple-500 ${playing ? 'animate-bounce' : ''}`} />}
                {p.id === 'shake' && <div className={`w-20 h-20 rounded-2xl bg-red-500 ${playing ? 'animate-pulse' : ''}`} style={{ animation: playing ? 'shake 0.3s' : 'none' }} />}
                {p.id === 'glow' && <div className="w-20 h-20 rounded-full bg-purple-500 animate-pulse" />}
                {p.id === 'lift' && <div className={`w-20 h-20 rounded-2xl bg-cyan-500 transition-all ${playing ? '-translate-y-2 shadow-2xl' : ''}`} />}
                {p.id === 'morph' && <div className={`w-20 h-20 rounded-full ${playing ? 'bg-purple-500 animate-spin' : 'bg-purple-500 rounded-xl'}`} />}
              </button>
              <button onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), 800); }} className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"><Play className="w-3.5 h-3.5" /> Play</button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-purple-400 font-medium mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Interaction Details</h4><p className="text-xs text-slate-400">{p.desc}</p><div className="mt-2 flex gap-2 text-[10px]"><span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Trigger: {p.trigger}</span><span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Duration: 300ms</span></div></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-purple-400 font-medium mb-1">Code</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`// ${p.name}\ntransition: all 300ms ${p.id === 'bounce' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'};\ntransform: ${p.id === 'lift' ? 'translateY(-8px)' : p.id === 'morph' ? 'scale(0.95)' : 'none'};`}</pre></div>
          </div>
        </div>
      </div>
    </div>
  );
}
