import { useState } from 'react';
import { Gauge, X, Zap, Accessibility, ShieldCheck, Search, TrendingUp } from 'lucide-react';

interface LighthouseScorePredictorProps {
  open: boolean;
  onClose: () => void;
}

interface Score {
  key: string;
  label: string;
  value: number;
  icon: typeof Zap;
  color: string;
}

const SCORES: Score[] = [
  { key: 'perf', label: 'Performance', value: 78, icon: Zap, color: 'text-amber-400' },
  { key: 'a11y', label: 'Accessibility', value: 92, icon: Accessibility, color: 'text-emerald-400' },
  { key: 'bp', label: 'Best Practices', value: 88, icon: ShieldCheck, color: 'text-emerald-400' },
  { key: 'seo', label: 'SEO', value: 95, icon: Search, color: 'text-emerald-400' },
];

const RECS: Record<string, string[]> = {
  perf: ['Reduce unused JS from 142 KB to under 80 KB', 'Serve images as WebP with responsive sizes', 'Preconnect to API origin to cut 120 ms TLS'],
  a11y: ['Add aria-label to 3 icon-only buttons', 'Ensure form inputs have associated labels'],
  bp: ['Remove console.log statements from production bundle', 'Set strict CSP header on deployed origin'],
  seo: ['Add canonical meta tags on paginated routes', 'Include structured data for app listings'],
};

function GaugeCircle({ value, color }: { value: number; color: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 72 72" className="w-16 h-16">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 36 36)" className={color} />
      <text x="36" y="40" textAnchor="middle" className="fill-slate-100 text-[15px] font-bold">{value}</text>
    </svg>
  );
}

export default function LighthouseScorePredictor({ open, onClose }: LighthouseScorePredictorProps) {
  const [active, setActive] = useState('perf');
  if (!open) return null;
  const activeScore = SCORES.find((s) => s.key === active)!;
  const avg = Math.round(SCORES.reduce((s, x) => s + x.value, 0) / SCORES.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Lighthouse Score Predictor</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <div className="grid grid-cols-4 gap-3">
            {SCORES.map((s) => (
              <button key={s.key} onClick={() => setActive(s.key)}
                className={`rounded-xl border bg-slate-800/40 p-2 flex flex-col items-center transition-all ${active === s.key ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' : 'border-slate-800 hover:border-slate-700'}`}>
                <GaugeCircle value={s.value} color={s.color} />
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><s.icon className="w-3 h-3" />{s.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500">Predicted average</span>
            <span className={`text-sm font-bold ${avg >= 90 ? 'text-emerald-400' : avg >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{avg}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex items-center gap-2 mb-3">
            <activeScore.icon className={`w-4 h-4 ${activeScore.color}`} />
            <h4 className="text-xs font-semibold text-slate-200">Recommendations — {activeScore.label}</h4>
          </div>
          <div className="space-y-2">
            {RECS[activeScore.key].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/30 p-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-300">{rec}</p>
                  <p className="text-[10px] text-slate-600 mt-1">Est. impact: +{2 + i * 3} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
