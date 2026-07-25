import { Eye, X, MousePointer, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { AppRegion, ColorScheme } from '@/types/builder';

interface HeatPoint {
  x: number;
  y: number;
  intensity: number;
  type: 'gaze' | 'click';
}

function generateHeatmap(width: number, height: number): HeatPoint[] {
  const points: HeatPoint[] = [];
  const hotspots = [
    { x: width * 0.5, y: height * 0.15, intensity: 0.9, type: 'gaze' as const },
    { x: width * 0.3, y: height * 0.35, intensity: 0.7, type: 'gaze' as const },
    { x: width * 0.7, y: height * 0.35, intensity: 0.6, type: 'gaze' as const },
    { x: width * 0.5, y: height * 0.55, intensity: 0.8, type: 'click' as const },
    { x: width * 0.5, y: height * 0.75, intensity: 0.95, type: 'click' as const },
  ];
  hotspots.forEach((h) => {
    for (let i = 0; i < 20; i++) {
      const spread = 40;
      points.push({ x: h.x + (Math.random() - 0.5) * spread, y: h.y + (Math.random() - 0.5) * spread, intensity: h.intensity * (1 - Math.random() * 0.5), type: h.type });
    }
  });
  return points;
}

interface AIHeatmapPredictorProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
}

export default function AIHeatmapPredictor({ open, onClose, regions, colorScheme, appName }: AIHeatmapPredictorProps) {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<'gaze' | 'click' | 'combined'>('combined');
  const [generating, setGenerating] = useState(true);
  const [points, setPoints] = useState<HeatPoint[]>([]);

  if (!open) return null;

  const width = 280;
  const height = 500;

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPoints(generateHeatmap(width, height));
      setGenerating(false);
    }, 1000);
  };

  if (generating && points.length === 0) setTimeout(generate, 100);

  const filtered = mode === 'combined' ? points : points.filter((p) => p.type === mode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Eye className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">AI Heatmap Predictor</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800">
          <select value={selected} onChange={(e) => { setSelected(Number(e.target.value)); setPoints([]); setGenerating(true); }} className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
            {regions.map((r, i) => <option key={r.id} value={i}>{r.region_name}</option>)}
          </select>
          <div className="flex items-center gap-1">
            {(['gaze', 'click', 'combined'] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={`text-xs px-2 py-1 rounded-full capitalize ${mode === m ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col items-center p-5 bg-slate-950/30">
          <div className="relative rounded-2xl border-[6px] border-slate-700 bg-slate-900 overflow-hidden" style={{ width: `${width}px`, height: `${height}px`, backgroundColor: colorScheme.background }}>
            {generating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /><p className="text-xs text-slate-500">Predicting user attention...</p></div>
            ) : (
              <>
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <radialGradient id="hot">{<stop offset="0%" stopColor="rgba(239,68,68,0.8)" />}<stop offset="40%" stopColor="rgba(245,158,11,0.5)" /><stop offset="70%" stopColor="rgba(34,197,94,0.3)" /><stop offset="100%" stopColor="rgba(34,197,94,0)" /></radialGradient>
                  </defs>
                  {filtered.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={25 + p.intensity * 20} fill="url(#hot)" opacity={p.intensity} />)}
                </svg>
                <div className="relative p-4 space-y-3" style={{ color: colorScheme.text }}>
                  <div className="text-center py-3"><p className="text-sm font-bold">{appName}</p></div>
                  {regions[selected]?.spec.elements.slice(0, 6).map((el, i) => (
                    <div key={i} className="rounded-lg p-3 text-xs text-center" style={{ backgroundColor: colorScheme.surface }}>{el.label ?? el.kind}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          {!generating && (
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <Eye className="w-4 h-4 text-purple-400" />
                <div><p className="text-xs text-slate-300">Top attention zone: <span className="text-purple-400 font-medium">Header area (92%)</span></p><p className="text-[10px] text-slate-500">Users spend 3.2s avg looking here first</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <MousePointer className="w-4 h-4 text-amber-400" />
                <div><p className="text-xs text-slate-300">Primary click target: <span className="text-amber-400 font-medium">CTA button (88%)</span></p><p className="text-[10px] text-slate-500">Expected click-through: 12-18%</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="w-4 h-4 rounded-full bg-slate-600" />
                <div><p className="text-xs text-slate-300">Dead zone: <span className="text-slate-500 font-medium">Bottom left (8%)</span></p><p className="text-[10px] text-slate-500">Consider moving important content away from here</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
