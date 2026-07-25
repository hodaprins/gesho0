import { useState, useEffect } from 'react';
import { MemoryStick, X, TrendingUp, AlertTriangle } from 'lucide-react';

interface MemoryLeakVisualizerProps {
  open: boolean;
  onClose: () => void;
}

interface LeakSuspect {
  name: string;
  size: string;
  count: number;
  trend: 'growing' | 'stable';
}

const SAMPLE_LEAKS: LeakSuspect[] = [
  { name: 'useEffect subscription', size: '2.4 MB', count: 18, trend: 'growing' },
  { name: 'Image cache (unbounded)', size: '5.1 MB', count: 312, trend: 'growing' },
  { name: 'Unmounted listener refs', size: '820 KB', count: 7, trend: 'stable' },
  { name: 'Timer callbacks', size: '440 KB', count: 4, trend: 'stable' },
];

export default function MemoryLeakVisualizer({ open, onClose }: MemoryLeakVisualizerProps) {
  const [points, setPoints] = useState<number[]>(() => Array.from({ length: 40 }, (_, i) => 48 + Math.sin(i / 3) * 6 + i * 0.4));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(40, Math.min(120, last + (Math.random() - 0.35) * 5));
        return [...prev.slice(1), next];
      });
      setTick((t) => t + 1);
    }, 700);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const current = points[points.length - 1];
  const baseline = points[0];
  const leaking = current > baseline + 6;
  const w = 460;
  const h = 120;
  const max = 130;
  const path = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(' L ');
  const areaPath = `M 0,${h} L ${path} L ${w},${h} Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MemoryStick className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-100">Memory Leak Visualizer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Live heap usage</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${leaking ? 'text-amber-400' : 'text-emerald-400'}`}>{current.toFixed(1)} MB</span>
              {leaking ? (
                <span className="flex items-center gap-1 text-[10px] text-amber-400"><TrendingUp className="w-3 h-3" />growing</span>
              ) : (
                <span className="text-[10px] text-emerald-400">stable</span>
              )}
            </div>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
            <defs>
              <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#memGrad)" />
            <path d={`M ${path}`} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1={h - (baseline / max) * h} x2={w} y2={h - (baseline / max) * h} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
            <span>baseline {baseline.toFixed(0)} MB</span>
            <span>tick #{tick}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold text-slate-200">Suspected leaks</h4>
          </div>
          {SAMPLE_LEAKS.map((leak, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{leak.name}</p>
                <p className="text-[10px] text-slate-500">{leak.count} allocations</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-violet-400">{leak.size}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${leak.trend === 'growing' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{leak.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
