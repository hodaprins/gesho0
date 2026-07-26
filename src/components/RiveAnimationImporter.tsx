import { Sparkles, X, Play, Cpu } from 'lucide-react';
import { useState } from 'react';

const STATE_MACHINES = ['Loading', 'Success', 'Error', 'Idle'];
const INPUTS = ['isLoading', 'isSuccess', 'isError', 'trigger'];

export default function RiveAnimationImporter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [machine, setMachine] = useState('Loading');
  const [playing, setPlaying] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Rive Animation Importer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              {playing && <div className={`w-20 h-20 rounded-full border-4 ${machine === 'Loading' ? 'border-cyan-400 border-t-transparent animate-spin' : machine === 'Success' ? 'border-emerald-400 flex items-center justify-center' : machine === 'Error' ? 'border-red-400' : 'border-slate-600'}`} style={{ animationDuration: '1s' }}>{machine === 'Success' && <span className="text-2xl">✓</span>}{machine === 'Error' && <span className="text-2xl text-red-400">✕</span>}</div>}
              <div className="absolute bottom-2 left-2 text-[9px] text-slate-500">animations.riv</div>
            </div>
          </div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">State Machine</h4><div className="flex items-center gap-1.5">{STATE_MACHINES.map(sm => <button key={sm} onClick={() => setMachine(sm)} className={`text-xs px-2.5 py-1 rounded-full ${machine === sm ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>{sm}</button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Input Parameters</h4><div className="grid grid-cols-2 gap-2">{INPUTS.map(inp => <div key={inp} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><div className="flex items-center justify-between"><span className="text-xs text-slate-300 font-mono">{inp}</span><div className={`w-4 h-4 rounded ${inp === 'isLoading' && machine === 'Loading' ? 'bg-cyan-400' : inp === 'isSuccess' && machine === 'Success' ? 'bg-emerald-400' : inp === 'isError' && machine === 'Error' ? 'bg-red-400' : 'bg-slate-700'}`} /></div></div>)}</div></div>
          <div className="flex items-center gap-2 justify-center"><button onClick={() => setPlaying(!playing)} className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center"><Play className="w-4 h-4" /></button></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center justify-between text-xs"><span className="text-slate-500">Artboard:</span><code className="text-cyan-400 font-mono">Main</code></div><div className="flex items-center justify-between text-xs mt-1"><span className="text-slate-500">File:</span><span className="text-slate-300">animations.riv · 45 KB</span></div><div className="flex items-center justify-between text-xs mt-1"><span className="text-slate-500 flex items-center gap-1"><Cpu className="w-3 h-3" /> Runtime:</span><span className="text-slate-300">Web / iOS / Android</span></div></div>
        </div>
      </div>
    </div>
  );
}
