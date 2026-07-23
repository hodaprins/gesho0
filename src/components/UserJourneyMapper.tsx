import { useState } from 'react';
import { Route, X, Plus, ArrowRight, Trash2 } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface JourneyStep {
  id: string;
  screen: string;
  event: string;
  dropoff: number;
}

const JOURNEYS: { id: string; name: string; steps: JourneyStep[]; completionRate: number }[] = [
  {
    id: 'onboarding',
    name: 'New User Onboarding',
    completionRate: 68,
    steps: [
      { id: '1', screen: 'Splash', event: 'App open', dropoff: 0 },
      { id: '2', screen: 'Welcome', event: 'View welcome', dropoff: 5 },
      { id: '3', screen: 'Signup', event: 'Start signup', dropoff: 18 },
      { id: '4', screen: 'Profile', event: 'Complete profile', dropoff: 9 },
      { id: '5', screen: 'Home', event: 'Reach home', dropoff: 0 },
    ],
  },
  {
    id: 'purchase',
    name: 'Purchase Flow',
    completionRate: 42,
    steps: [
      { id: '1', screen: 'Product List', event: 'Browse products', dropoff: 0 },
      { id: '2', screen: 'Product Detail', event: 'View detail', dropoff: 22 },
      { id: '3', screen: 'Cart', event: 'Add to cart', dropoff: 15 },
      { id: '4', screen: 'Checkout', event: 'Start checkout', dropoff: 12 },
      { id: '5', screen: 'Confirmation', event: 'Complete purchase', dropoff: 9 },
    ],
  },
];

interface UserJourneyMapperProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

export default function UserJourneyMapper({ open, onClose, regions }: UserJourneyMapperProps) {
  const [selected, setSelected] = useState(0);
  if (!open) return null;

  const current = JOURNEYS[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">User Journeys</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          {JOURNEYS.map((j, i) => (
            <button key={j.id} onClick={() => setSelected(i)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
              {j.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-200">{current.name}</h4>
            <span className="text-xs text-emerald-400">{current.completionRate}% completion</span>
          </div>

          <div className="space-y-1">
            {current.steps.map((step, i) => (
              <div key={step.id}>
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{step.screen}</p>
                    <p className="text-[10px] text-slate-500">{step.event}</p>
                  </div>
                  {step.dropoff > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">-{step.dropoff}% dropoff</span>
                  )}
                </div>
                {i < current.steps.length - 1 && (
                  <div className="flex justify-center py-1"><ArrowRight className="w-4 h-4 text-slate-700 rotate-90" /></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h5 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Funnel Visualization</h5>
            <div className="space-y-1.5">
              {current.steps.map((step, i) => {
                const width = 100 - current.steps.slice(0, i).reduce((s, x) => s + x.dropoff, 0);
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="h-6 rounded bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500" style={{ width: `${width}%` }} />
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{Math.round(width)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
