import { TrendingUp, X, Users, Percent, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface AppMarketSizingToolProps {
  open: boolean;
  onClose: () => void;
}

export default function AppMarketSizingTool({ open, onClose }: AppMarketSizingToolProps) {
  const [population, setPopulation] = useState(50000000);
  const [penetration, setPenetration] = useState(20);
  const [arpu, setArpu] = useState(48);

  if (!open) return null;

  const tam = population * arpu;
  const sam = tam * (penetration / 100) * 0.4;
  const som = sam * 0.15;

  const segments = [
    { label: 'TAM', value: tam, color: 'from-indigo-500 to-purple-500', pct: 100, hint: 'Total Addressable' },
    { label: 'SAM', value: sam, color: 'from-cyan-500 to-blue-500', pct: (sam / tam) * 100, hint: 'Serviceable Addressable' },
    { label: 'SOM', value: som, color: 'from-emerald-500 to-teal-500', pct: (som / tam) * 100, hint: 'Serviceable Obtainable' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Market Sizing Tool</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Users className="w-3 h-3" /> Target Population</label><span className="text-xs font-mono text-slate-200">{population.toLocaleString()}</span></div><input type="range" min="100000" max="500000000" step="100000" value={population} onChange={(e) => setPopulation(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Percent className="w-3 h-3" /> Penetration Rate</label><span className="text-xs font-mono text-slate-200">{penetration}%</span></div><input type="range" min="1" max="80" step="1" value={penetration} onChange={(e) => setPenetration(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> ARPU (annual $)</label><span className="text-xs font-mono text-slate-200">${arpu}</span></div><input type="range" min="1" max="500" step="1" value={arpu} onChange={(e) => setArpu(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Market Funnel</h4>
            <div className="space-y-2">
              {segments.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-slate-200">{s.label}</span><span className="text-[10px] text-slate-500">{s.hint}</span></div>
                  <div className="h-8 rounded-lg bg-slate-800 overflow-hidden flex items-center"><div className={`h-full bg-gradient-to-r ${s.color} flex items-center justify-end pr-2`} style={{ width: `${Math.max(s.pct, 4)}%` }}><span className="text-[9px] font-bold text-white">${(s.value / 1000000).toFixed(1)}M</span></div></div>
                  <p className="text-[10px] text-slate-500 mt-1.5">${s.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
