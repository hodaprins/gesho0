import { Share2, X, Users, Percent, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ViralCoefficientCalculatorProps {
  open: boolean;
  onClose: () => void;
}

export default function ViralCoefficientCalculator({ open, onClose }: ViralCoefficientCalculatorProps) {
  const [invites, setInvites] = useState(3);
  const [conversion, setConversion] = useState(25);

  if (!open) return null;

  const kFactor = (invites * conversion) / 100;
  const isViral = kFactor > 1;
  const cycles = isViral ? Infinity : kFactor > 0 ? 1 / (1 - kFactor) : 0;
  const growthMultiple = isViral ? 'Unlimited' : `${(cycles * 100).toFixed(0)}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Share2 className="w-5 h-5 text-fuchsia-400" /><h3 className="text-sm font-semibold text-slate-100">Viral Coefficient Calculator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className={`rounded-2xl border-2 p-6 text-center ${isViral ? 'border-fuchsia-500/30 bg-fuchsia-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Viral Coefficient (K)</p>
            <p className={`text-4xl font-bold ${isViral ? 'text-fuchsia-400' : 'text-slate-300'}`}>{kFactor.toFixed(2)}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {isViral ? <TrendingUp className="w-4 h-4 text-fuchsia-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span className={`text-xs font-medium ${isViral ? 'text-fuchsia-400' : 'text-amber-400'}`}>{isViral ? 'Viral growth — K > 1' : 'Linear growth — K < 1'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Users className="w-3 h-3" /> Invites per User</label><span className="text-xs font-mono text-slate-200">{invites}</span></div><input type="range" min="0" max="20" step="1" value={invites} onChange={(e) => setInvites(Number(e.target.value))} className="w-full accent-fuchsia-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Percent className="w-3 h-3" /> Conversion Rate</label><span className="text-xs font-mono text-slate-200">{conversion}%</span></div><input type="range" min="0" max="100" step="1" value={conversion} onChange={(e) => setConversion(Number(e.target.value))} className="w-full accent-fuchsia-500" /></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Formula</span><p className="text-sm font-bold text-slate-200 mt-1">{invites} × {conversion}%</p></div>
            <div className="rounded-lg bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Growth Multiple</span><p className="text-sm font-bold text-slate-200 mt-1">{growthMultiple}</p></div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">User Growth Simulation</p>
            {(() => {
              const points = [1000]; let users = 1000;
              for (let i = 0; i < 6; i++) { users = users + users * kFactor; points.push(Math.round(users)); }
              const max = Math.max(...points);
              return (
                <div className="flex items-end gap-1.5 h-24">
                  {points.map((p, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full rounded-t ${isViral ? 'bg-gradient-to-t from-fuchsia-600 to-fuchsia-400' : 'bg-gradient-to-t from-slate-700 to-slate-500'}`} style={{ height: `${(p / max) * 100}%` }} />
                      <span className="text-[8px] text-slate-600">{i}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
