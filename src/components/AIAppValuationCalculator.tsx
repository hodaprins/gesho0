import { TrendingUp, X, BarChart3, DollarSign, Users, Star } from 'lucide-react';
import { useState } from 'react';

interface ValuationFactor {
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

interface AIAppValuationCalculatorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function AIAppValuationCalculator({ open, onClose, appName }: AIAppValuationCalculatorProps) {
  const [users, setUsers] = useState(10000);
  const [arpu, setArpu] = useState(3.5);
  const [growth, setGrowth] = useState(15);
  const [retention, setRetention] = useState(45);

  if (!open) return null;

  const monthlyRevenue = users * arpu;
  const annualRevenue = monthlyRevenue * 12;
  const valuationMultiplier = 3 + (growth / 20) + (retention / 25);
  const valuation = Math.round(annualRevenue * valuationMultiplier);

  const factors: ValuationFactor[] = [
    { label: 'User Base', score: Math.min(users / 100, 100), maxScore: 100, description: `${users.toLocaleString()} users` },
    { label: 'Revenue/User', score: Math.min(arpu * 15, 100), maxScore: 100, description: `$${arpu}/month ARPU` },
    { label: 'Growth Rate', score: Math.min(growth * 4, 100), maxScore: 100, description: `${growth}% monthly` },
    { label: 'Retention', score: retention, maxScore: 100, description: `${retention}% D30 retention` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">App Valuation Calculator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estimated Valuation</p>
            <p className="text-4xl font-bold text-emerald-400">${valuation.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Based on {valuationMultiplier.toFixed(1)}x annual revenue multiplier</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-3"><div className="flex items-center gap-1.5 mb-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /><span className="text-[10px] text-slate-500">Monthly Revenue</span></div><p className="text-sm font-bold text-slate-200">${monthlyRevenue.toLocaleString()}</p></div>
            <div className="rounded-lg bg-slate-800/50 p-3"><div className="flex items-center gap-1.5 mb-1"><BarChart3 className="w-3.5 h-3.5 text-cyan-400" /><span className="text-[10px] text-slate-500">Annual Revenue</span></div><p className="text-sm font-bold text-slate-200">${annualRevenue.toLocaleString()}</p></div>
          </div>

          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Users className="w-3 h-3" /> Monthly Active Users</label><span className="text-xs font-mono text-slate-200">{users.toLocaleString()}</span></div><input type="range" min="100" max="100000" step="100" value={users} onChange={(e) => setUsers(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> ARPU ($/month)</label><span className="text-xs font-mono text-slate-200">${arpu}</span></div><input type="range" min="0" max="20" step="0.5" value={arpu} onChange={(e) => setArpu(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Monthly Growth (%)</label><span className="text-xs font-mono text-slate-200">{growth}%</span></div><input type="range" min="0" max="50" step="1" value={growth} onChange={(e) => setGrowth(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Star className="w-3 h-3" /> D30 Retention (%)</label><span className="text-xs font-mono text-slate-200">{retention}%</span></div><input type="range" min="10" max="90" step="5" value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Valuation Factors</h4>
            <div className="space-y-1.5">
              {factors.map((f) => (
                <div key={f.label} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-300">{f.label}</span><span className="text-[10px] text-slate-500">{f.description}</span></div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${f.score}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
