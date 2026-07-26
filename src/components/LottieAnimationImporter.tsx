import { Film, X, Play, Pause, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function LottieAnimationImporter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(100);
  const [progress, setProgress] = useState(35);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Film className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Lottie Animation Importer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              {playing && <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse" style={{ animationDuration: `${2 / (speed / 100)}s` }} />}
              <div className="absolute bottom-2 left-2 text-[9px] text-slate-500">loading.json</div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <button onClick={() => setPlaying(!playing)} className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
            <button onClick={() => { setProgress(0); setPlaying(true); }} className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={() => setLoop(!loop)} className={`px-3 h-10 rounded-full text-xs font-medium ${loop ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>Loop</button>
          </div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Playback Speed</label><span className="text-xs font-mono text-slate-200">{speed}%</span></div><input type="range" min="25" max="300" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-amber-500" /></div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Frame Scrubber</label><span className="text-xs font-mono text-slate-200">{progress}%</span></div><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-amber-500" /></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center justify-between text-xs"><span className="text-slate-500">File:</span><code className="text-amber-400 font-mono">loading.json · 12 KB</code></div><div className="flex items-center justify-between text-xs mt-1"><span className="text-slate-500">Frames:</span><span className="text-slate-300">120 @ 60fps</span></div><div className="flex items-center justify-between text-xs mt-1"><span className="text-slate-500">Total size:</span><span className="text-slate-300">12 KB (vs 340 KB GIF)</span></div></div>
        </div>
      </div>
    </div>
  );
}
