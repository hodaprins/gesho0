import { useState } from 'react';
import { FlaskConical, X, Plus, Trash2, Check, BarChart3 } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  weight: number;
  conversionRate: number;
  visitors: number;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  variants: Variant[];
  metric: string;
}

interface ABTestingPanelProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL_TESTS: ABTest[] = [
  {
    id: '1',
    name: 'CTA Button Color',
    status: 'running',
    metric: 'Tap-through rate',
    variants: [
      { id: 'a', name: 'Control (Teal)', weight: 50, conversionRate: 12.4, visitors: 3420 },
      { id: 'b', name: 'Variant B (Orange)', weight: 50, conversionRate: 15.8, visitors: 3380 },
    ],
  },
  {
    id: '2',
    name: 'Onboarding Flow Length',
    status: 'completed',
    metric: 'Completion rate',
    variants: [
      { id: 'a', name: '3 steps', weight: 50, conversionRate: 68, visitors: 2100 },
      { id: 'b', name: '5 steps', weight: 50, conversionRate: 54, visitors: 2080 },
    ],
  },
];

export default function ABTestingPanel({ open, onClose }: ABTestingPanelProps) {
  const [tests, setTests] = useState<ABTest[]>(INITIAL_TESTS);
  const [selected, setSelected] = useState(0);

  if (!open) return null;

  const current = tests[selected];
  const winner = current.variants.reduce((max, v) => (v.conversionRate > max.conversionRate ? v : max), current.variants[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">A/B Testing</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2">
            {tests.map((t, i) => (
              <button key={t.id} onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}>
                <p className="font-medium truncate">{t.name}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${t.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'completed' ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/20 text-amber-400'} capitalize`}>{t.status}</span>
              </button>
            ))}
            <button onClick={() => setTests((p) => [...p, { id: crypto.randomUUID(), name: 'New Test', status: 'draft', metric: 'Conversion rate', variants: [{ id: 'a', name: 'Control', weight: 50, conversionRate: 0, visitors: 0 }, { id: 'b', name: 'Variant B', weight: 50, conversionRate: 0, visitors: 0 }] }])}
              className="w-full px-3 py-2 text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3 h-3" /> New test
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-200">{current.name}</h4>
              <span className="text-xs text-slate-500">Metric: {current.metric}</span>
            </div>

            {current.status === 'completed' && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400">Winner: <strong>{winner.name}</strong> with {winner.conversionRate}% conversion</span>
              </div>
            )}

            <div className="space-y-3">
              {current.variants.map((v) => {
                const isWinner = v.id === winner.id;
                const maxCR = Math.max(...current.variants.map((x) => x.conversionRate));
                return (
                  <div key={v.id} className={`rounded-xl border p-4 ${isWinner && current.status !== 'draft' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-200">{v.name}</span>
                      {isWinner && current.status !== 'draft' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Winner</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span>{v.visitors.toLocaleString()} visitors</span>
                      <span>{v.weight}% traffic</span>
                      <span className="text-slate-200 font-mono">{v.conversionRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${isWinner ? 'bg-emerald-500' : 'bg-slate-600'}`} style={{ width: `${maxCR > 0 ? (v.conversionRate / maxCR) * 100 : 0}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-cyan-400" /><span className="text-xs text-slate-300 font-medium">Statistical significance</span></div>
              <p className="text-xs text-slate-500">{current.status === 'running' ? 'Collecting data... 87% confidence level' : current.status === 'completed' ? '95% confidence - result is significant' : 'Not started'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
