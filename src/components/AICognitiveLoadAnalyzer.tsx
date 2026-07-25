import { Brain, X, AlertTriangle, Check, Zap } from 'lucide-react';
import { useState } from 'react';
import type { AppRegion } from '@/types/builder';

interface ScreenLoad {
  screenId: string;
  screenName: string;
  load: number;
  factors: { label: string; weight: number }[];
}

interface AICognitiveLoadAnalyzerProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

function analyzeScreen(region: AppRegion): ScreenLoad {
  const elements = region.spec.elements;
  let load = 20;
  const factors: { label: string; weight: number }[] = [];
  if (elements.length > 5) { load += (elements.length - 5) * 8; factors.push({ label: `${elements.length} elements on screen`, weight: (elements.length - 5) * 8 }); }
  const inputs = elements.filter((e) => e.kind === 'input').length;
  if (inputs > 2) { load += inputs * 5; factors.push({ label: `${inputs} input fields`, weight: inputs * 5 }); }
  const buttons = elements.filter((e) => e.kind === 'button').length;
  if (buttons > 3) { load += (buttons - 3) * 4; factors.push({ label: `${buttons} buttons (decision fatigue)`, weight: (buttons - 3) * 4 }); }
  if (elements.some((e) => e.kind === 'list')) { load += 10; factors.push({ label: 'Scrollable list', weight: 10 }); }
  if (elements.some((e) => e.kind === 'image')) { load += 5; factors.push({ label: 'Visual content', weight: 5 }); }
  factors.push({ label: 'Base cognitive cost', weight: 20 });
  return { screenId: region.id, screenName: region.region_name, load: Math.min(load, 100), factors };
}

export default function AICognitiveLoadAnalyzer({ open, onClose, regions }: AICognitiveLoadAnalyzerProps) {
  const [selected, setSelected] = useState(0);
  if (!open) return null;

  const analyzed = regions.map(analyzeScreen);
  const current = analyzed[selected] ?? analyzed[0];
  const avgLoad = Math.round(analyzed.reduce((s, a) => s + a.load, 0) / analyzed.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Cognitive Load Analyzer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{avgLoad}</p><p className="text-[10px] text-slate-500">Avg Load</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{analyzed.filter((a) => a.load > 60).length}</p><p className="text-[10px] text-slate-500">Overloaded</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{analyzed.filter((a) => a.load < 40).length}</p><p className="text-[10px] text-slate-500">Optimal</p></div>
        </div>

        <div className="px-5 py-2 border-b border-slate-800">
          <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
            {analyzed.map((a, i) => <option key={a.screenId} value={i}>{a.screenName} — Load: {a.load}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-200">{current.screenName}</span>
              <span className={`text-2xl font-bold ${current.load > 60 ? 'text-red-400' : current.load > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{current.load}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${current.load > 60 ? 'bg-red-500' : current.load > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${current.load}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{current.load > 60 ? 'High cognitive load — users will feel overwhelmed' : current.load > 40 ? 'Moderate load — acceptable but could be simplified' : 'Optimal load — easy to process'}</p>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Contributing Factors</h4>
            <div className="space-y-1.5">
              {current.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-slate-300 flex-1">{f.label}</span>
                  <span className="text-xs font-mono text-amber-400">+{f.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
            <h4 className="text-xs text-purple-400 font-medium mb-1.5 flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> AI Recommendations</h4>
            <ul className="space-y-1 text-xs text-slate-400">
              {current.load > 60 && <li className="flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Break this screen into 2-3 simpler screens</li>}
              {current.factors.some((f) => f.label.includes('input')) && <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Use progressive disclosure for form fields</li>}
              {current.factors.some((f) => f.label.includes('button')) && <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Group secondary actions in a menu</li>}
              <li className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Use visual hierarchy to guide attention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
