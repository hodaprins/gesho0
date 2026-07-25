import { Film, X, Play, Plus, Diamond, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Keyframe {
  id: string;
  time: number;
  property: string;
  value: string;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
}

const KEYFRAMES: Keyframe[] = [
  { id: '1', time: 0, property: 'opacity', value: '0', easing: 'linear' },
  { id: '2', time: 200, property: 'opacity', value: '1', easing: 'ease-out' },
  { id: '3', time: 200, property: 'translateY', value: '20px', easing: 'ease-out' },
  { id: '4', time: 500, property: 'translateY', value: '0px', easing: 'spring' },
  { id: '5', time: 500, property: 'scale', value: '0.8', easing: 'ease-in-out' },
  { id: '6', time: 800, property: 'scale', value: '1.0', easing: 'spring' },
];

const PROPERTIES = ['opacity', 'translateY', 'translateX', 'scale', 'rotate', 'backgroundColor', 'borderRadius'];
const EASINGS = ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'spring'];

interface TimelineAnimationComposerProps {
  open: boolean;
  onClose: () => void;
}

export default function TimelineAnimationComposer({ open, onClose }: TimelineAnimationComposerProps) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [keyframes, setKeyframes] = useState(KEYFRAMES);
  if (!open) return null;

  const maxTime = Math.max(...keyframes.map((k) => k.time));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Film className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Animation Composer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button onClick={() => { setPlaying(!playing); if (!playing) { setTime(0); const interval = setInterval(() => setTime((t) => { if (t >= maxTime) { clearInterval(interval); setPlaying(false); return 0; } return t + 50; }), 50); } }} className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/30"><Play className="w-4 h-4" /></button>
            <div className="flex-1"><div className="h-2 rounded-full bg-slate-800 relative"><div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400" style={{ left: `${(time / maxTime) * 100}%` }} /><div className="h-full rounded-full bg-cyan-500/30" style={{ width: `${(time / maxTime) * 100}%` }} /></div></div>
            <span className="text-xs font-mono text-slate-400 w-20 text-right">{time}ms / {maxTime}ms</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {keyframes.map((k) => (
            <div key={k.id} className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2">
              <Diamond className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="text-xs font-mono text-slate-300 w-20">{k.property}</span>
              <div className="flex-1 relative h-4"><div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" style={{ left: `${(k.time / maxTime) * 100}%` }} /></div>
              <span className="text-xs font-mono text-amber-400 w-12 text-right">{k.value}</span>
              <span className="text-[10px] text-slate-500 w-16">{k.easing}</span>
              <button onClick={() => setKeyframes((p) => p.filter((x) => x.id !== k.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setKeyframes((p) => [...p, { id: crypto.randomUUID(), time: 0, property: 'opacity', value: '1', easing: 'ease-out' as const }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add keyframe</button>
          <span className="text-xs text-slate-500">Duration: {maxTime}ms · {keyframes.length} keyframes</span>
        </div>
      </div>
    </div>
  );
}
