import { AlertTriangle, X, TrendingDown, Users, Clock } from 'lucide-react';
import { useState } from 'react';

interface ChurnRisk {
  userId: string;
  name: string;
  riskScore: number;
  factors: string[];
  lastActive: string;
  daysInactive: number;
}

const AT_RISK: ChurnRisk[] = [
  { userId: 'u1', name: 'John D.', riskScore: 87, factors: ['Session time dropped 60%', 'Has not opened in 5 days', 'Skipped onboarding step 3'], lastActive: '5d ago', daysInactive: 5 },
  { userId: 'u2', name: 'Sarah K.', riskScore: 72, factors: ['No purchases in 14 days', 'Disabled push notifications'], lastActive: '3d ago', daysInactive: 3 },
  { userId: 'u3', name: 'Mike R.', riskScore: 65, factors: ['App crashes reported', 'Short sessions (under 30s)'], lastActive: '2d ago', daysInactive: 2 },
  { userId: 'u4', name: 'Lisa W.', riskScore: 54, factors: ['Has not used premium features', 'Downgraded plan'], lastActive: '7d ago', daysInactive: 7 },
  { userId: 'u5', name: 'Tom B.', riskScore: 41, factors: ['Reduced usage frequency'], lastActive: '1d ago', daysInactive: 1 },
  { userId: 'u6', name: 'Amy L.', riskScore: 38, factors: ['Short sessions lately'], lastActive: '1d ago', daysInactive: 1 },
];

interface PredictiveChurnIndicatorProps {
  open: boolean;
  onClose: () => void;
}

export default function PredictiveChurnIndicator({ open, onClose }: PredictiveChurnIndicatorProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  if (!open) return null;

  const filtered = filter === 'all' ? AT_RISK : filter === 'high' ? AT_RISK.filter((u) => u.riskScore >= 70) : AT_RISK.filter((u) => u.riskScore >= 40 && u.riskScore < 70);
  const avgRisk = Math.round(AT_RISK.reduce((s, u) => s + u.riskScore, 0) / AT_RISK.length);
  const willChurn = AT_RISK.filter((u) => u.riskScore >= 70).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-400" /><h3 className="text-sm font-semibold text-slate-100">Churn Predictor</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-lg font-bold text-red-400">{willChurn}</p><p className="text-[10px] text-slate-500">High Risk</p></div>
          <div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-lg font-bold text-amber-400">{AT_RISK.length - willChurn}</p><p className="text-[10px] text-slate-500">Medium Risk</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{avgRisk}</p><p className="text-[10px] text-slate-500">Avg Risk Score</p></div>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          {(['all', 'high', 'medium'] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${filter === f ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{f} risk</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {filtered.map((u) => (
            <div key={u.userId} className={`rounded-xl border p-3 ${u.riskScore >= 70 ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">{u.name.charAt(0)}</div><div><p className="text-sm font-medium text-slate-200">{u.name}</p><p className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{u.lastActive}</p></div></div>
                <div className="text-right"><p className={`text-2xl font-bold ${u.riskScore >= 70 ? 'text-red-400' : 'text-amber-400'}`}>{u.riskScore}</p><p className="text-[9px] text-slate-500">risk score</p></div>
              </div>
              <div className="flex flex-wrap gap-1">
                {u.factors.map((f, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs text-slate-400">Send a re-engagement campaign to <span className="text-red-400 font-medium">{willChurn} high-risk users</span> before they churn</p>
        </div>
      </div>
    </div>
  );
}
