import { Crosshair, X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CompetitorFeature {
  name: string;
  you: boolean;
  competitors: boolean[];
  impact: 'high' | 'medium' | 'low';
}

interface Competitor {
  name: string;
  users: string;
  rating: number;
}

const COMPETITORS: Competitor[] = [
  { name: 'AppA', users: '2.1M', rating: 4.6 },
  { name: 'AppB', users: '850K', rating: 4.3 },
  { name: 'AppC', users: '420K', rating: 4.1 },
];

const FEATURES: CompetitorFeature[] = [
  { name: 'Dark Mode', you: true, competitors: [true, true, true], impact: 'low' },
  { name: 'Push Notifications', you: true, competitors: [true, true, false], impact: 'medium' },
  { name: 'Offline Mode', you: false, competitors: [true, true, false], impact: 'high' },
  { name: 'AI Recommendations', you: false, competitors: [true, false, false], impact: 'high' },
  { name: 'Social Login', you: true, competitors: [true, true, true], impact: 'low' },
  { name: 'Widget Support', you: false, competitors: [true, false, false], impact: 'medium' },
  { name: 'Apple Watch App', you: false, competitors: [true, false, false], impact: 'medium' },
  { name: 'Voice Search', you: false, competitors: [false, true, false], impact: 'high' },
  { name: 'Multi-language', you: true, competitors: [true, true, false], impact: 'medium' },
  { name: 'Family Sharing', you: false, competitors: [false, false, true], impact: 'low' },
];

interface AICompetitorGapAnalyzerProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function AICompetitorGapAnalyzer({ open, onClose, appName }: AICompetitorGapAnalyzerProps) {
  const [category, setCategory] = useState('Productivity');
  if (!open) return null;

  const gaps = FEATURES.filter((f) => !f.you && f.competitors.some((c) => c));
  const unique = FEATURES.filter((f) => f.you && !f.competitors.some((c) => c));
  const oppScore = Math.round((gaps.filter((g) => g.impact === 'high').length / gaps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Crosshair className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Competitor Gap Analysis</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800">
          <span className="text-xs text-slate-500">Category:</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-slate-200">
            {['Productivity', 'Social', 'E-commerce', 'Health', 'Finance', 'Education'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="text-xs text-slate-500 ml-auto">{COMPETITORS.length} competitors analyzed</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-lg font-bold text-red-400">{gaps.length}</p><p className="text-[10px] text-slate-500">Feature Gaps</p></div>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{unique.length}</p><p className="text-[10px] text-slate-500">Unique to You</p></div>
            <div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-lg font-bold text-amber-400">{oppScore}%</p><p className="text-[10px] text-slate-500">Opportunity</p></div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Competitors</h4>
            <div className="grid grid-cols-3 gap-2">
              {COMPETITORS.map((c) => (
                <div key={c.name} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
                  <p className="text-sm font-bold text-slate-200">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.users} users</p>
                  <p className="text-xs text-amber-400">★ {c.rating}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-red-400" /> Critical Gaps — Features competitors have that you don't</h4>
            <div className="space-y-1.5">
              {gaps.map((f) => (
                <div key={f.name} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${f.impact === 'high' ? 'bg-red-500/20 text-red-400' : f.impact === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{f.impact}</span>
                  <span className="text-sm text-slate-200 flex-1">{f.name}</span>
                  <div className="flex items-center gap-1">
                    {f.competitors.map((c, i) => c && <span key={i} className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">{COMPETITORS[i].name}</span>)}
                  </div>
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-400" /> Your Unique Advantages</h4>
            <div className="space-y-1.5">
              {unique.length === 0 ? <p className="text-xs text-slate-500 italic">No unique features yet. Consider adding differentiators.</p> : unique.map((f) => (
                <div key={f.name} className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <span className="text-sm text-slate-200 flex-1">{f.name}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
