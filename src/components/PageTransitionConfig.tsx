import { useState } from 'react';
import { ArrowLeftRight, X, Play, RotateCcw, MoveHorizontal, Sparkles } from 'lucide-react';

interface PageTransitionConfigProps {
  open: boolean;
  onClose: () => void;
}

const TRANSITION_TYPES = [
  { id: 'fade', label: 'Fade' },
  { id: 'slide', label: 'Slide' },
  { id: 'scale', label: 'Scale' },
  { id: 'none', label: 'None' },
];

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const;

export default function PageTransitionConfig({ open, onClose }: PageTransitionConfigProps) {
  const [type, setType] = useState('slide');
  const [duration, setDuration] = useState(300);
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>('right');
  const [playing, setPlaying] = useState(false);

  if (!open) return null;

  const playPreview = () => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), duration + 400);
  };

  const animClass = playing
    ? type === 'fade' ? 'opacity-0'
      : type === 'scale' ? 'scale-75 opacity-0'
      : type === 'slide' ? (direction === 'left' ? '-translate-x-12 opacity-0' : direction === 'right' ? 'translate-x-12 opacity-0' : direction === 'up' ? '-translate-y-12 opacity-0' : 'translate-y-12 opacity-0')
      : ''
    : 'opacity-100 scale-100 translate-x-0 translate-y-0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">Page Transitions</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-2 block">Transition Type</label>
            <div className="grid grid-cols-4 gap-2">
              {TRANSITION_TYPES.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={`text-xs py-2.5 rounded-lg border transition-colors ${type === t.id ? 'border-teal-500/50 bg-teal-500/10 text-teal-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>{t.label}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">Duration</label>
              <span className="text-xs text-teal-400 font-mono">{duration}ms</span>
            </div>
            <input type="range" min={100} max={1000} step={50} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-teal-500" />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>100ms</span><span>1000ms</span></div>
          </div>

          {type === 'slide' && (
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5"><MoveHorizontal className="w-3.5 h-3.5" /> Direction</label>
              <div className="grid grid-cols-4 gap-2">
                {DIRECTIONS.map((d) => (
                  <button key={d} onClick={() => setDirection(d)} className={`text-xs py-2 rounded-lg border capitalize transition-colors ${direction === d ? 'border-teal-500/50 bg-teal-500/10 text-teal-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>{d}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Live Preview</label>
              <div className="flex gap-1.5">
                <button onClick={playPreview} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors"><Play className="w-3 h-3" /> Play</button>
                <button onClick={() => { setType('slide'); setDuration(300); setDirection('right'); }} className="text-slate-500 hover:text-slate-300"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="relative h-32 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden flex items-center justify-center">
              <div className={`transition-all ease-out ${animClass}`} style={{ transitionDuration: `${duration}ms` }}>
                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <span className="text-[10px] text-white font-medium">Page</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-xs px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors font-medium">Apply</button>
        </div>
      </div>
    </div>
  );
}
