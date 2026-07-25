import { DollarSign, X, TrendingUp, Percent } from 'lucide-react';
import { useState } from 'react';

interface RevenueProjectionEngineProps {
  open: boolean;
  onClose: () => void;
}

export default function RevenueProjectionEngine({ open, onClose }: RevenueProjectionEngineProps) {
  const [mrr, setMrr] = useState(20000);
  const [growth, setGrowth] = useState(15);
  const [churn, setChurn] = useState(5);

  if (!open) return null;

  const netGrowth = (growth - churn) / 100;
  const months = Array.from({ length: 12 }, (_, i) => {
    return Math.round(mrr * Math.pow(1 + netGrowth, i + 1));
  });
  const maxVal = Math.max(...months);
  const arr = months[11] * 12;

  const chartW = 460;
  const chartH = 160;
  const points = months.map((v, i) => {
    const x = 30 + (i / 11) * (chartW - 50);
    const y = chartH - 20 - (v / maxVal) * (chartH - 40);
    return { x, y, v };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[11].x} ${chartH - 20} L ${points[0].x} ${chartH - 20} Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Revenue Projection Engine</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Current MRR</span><p className="text-sm font-bold text-slate-200 mt-1">${mrr.toLocaleString()}</p></div>
            <div className="rounded-lg bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Net Growth</span><p className="text-sm font-bold text-emerald-400 mt-1">+{(netGrowth * 100).toFixed(1)}%</p></div>
            <div className="rounded-lg bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Projected ARR</span><p className="text-sm font-bold text-emerald-400 mt-1">${(arr / 1000).toFixed(0)}k</p></div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-emerald-400" /><span className="text-xs text-slate-300 font-medium">12-Month Projection</span></div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="overflow-visible">
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line key={t} x1={30} x2={chartW - 20} y1={chartH - 20 - t * (chartH - 40)} y2={chartH - 20 - t * (chartH - 40)} stroke="#1e293b" strokeWidth="1" />
              ))}
              <path d={areaD} fill="url(#revGrad)" />
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" />
              {points.map((p, i) => (
                <g key={i}><circle cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />
                  <text x={p.x} y={chartH - 5} textAnchor="middle" fontSize="9" fill="#64748b">{i + 1}</text></g>
              ))}
            </svg>
          </div>

          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Current MRR ($)</label><span className="text-xs font-mono text-slate-200">${mrr.toLocaleString()}</span></div><input type="range" min="1000" max="200000" step="1000" value={mrr} onChange={(e) => setMrr(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Growth Rate (%)</label><span className="text-xs font-mono text-slate-200">{growth}%</span></div><input type="range" min="0" max="50" step="1" value={growth} onChange={(e) => setGrowth(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Percent className="w-3 h-3" /> Churn Rate (%)</label><span className="text-xs font-mono text-slate-200">{churn}%</span></div><input type="range" min="0" max="30" step="1" value={churn} onChange={(e) => setChurn(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
