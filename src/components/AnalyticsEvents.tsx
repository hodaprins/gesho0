import { useState } from 'react';
import { Target, X, Plus, Trash2, TrendingDown } from 'lucide-react';

interface AnalyticsEvent {
  id: string;
  name: string;
  trigger: string;
  count: number;
  conversionRate: number;
}

interface Funnel {
  id: string;
  name: string;
  steps: string[];
  conversionRate: number;
  dropoff: number;
}

const INITIAL_EVENTS: AnalyticsEvent[] = [
  { id: '1', name: 'screen_view', trigger: 'Screen load', count: 12480, conversionRate: 100 },
  { id: '2', name: 'button_tap', trigger: 'User tap', count: 8420, conversionRate: 67 },
  { id: '3', name: 'form_submit', trigger: 'Form submission', count: 3210, conversionRate: 38 },
  { id: '4', name: 'purchase_complete', trigger: 'Payment success', count: 890, conversionRate: 11 },
  { id: '5', name: 'share_tapped', trigger: 'Share button', count: 420, conversionRate: 5 },
];

const INITIAL_FUNNELS: Funnel[] = [
  { id: '1', name: 'Purchase Funnel', steps: ['Browse', 'Detail', 'Cart', 'Checkout', 'Purchase'], conversionRate: 7.1, dropoff: 92.9 },
  { id: '2', name: 'Signup Funnel', steps: ['Landing', 'Signup', 'Verify', 'Profile', 'Home'], conversionRate: 68, dropoff: 32 },
];

interface AnalyticsEventsProps {
  open: boolean;
  onClose: () => void;
}

export default function AnalyticsEvents({ open, onClose }: AnalyticsEventsProps) {
  const [tab, setTab] = useState<'events' | 'funnels'>('events');
  const [events, setEvents] = useState<AnalyticsEvent[]>(INITIAL_EVENTS);
  const [funnels, setFunnels] = useState<Funnel[]>(INITIAL_FUNNELS);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Target className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Analytics Events</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          <button onClick={() => setTab('events')} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${tab === 'events' ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>Events</button>
          <button onClick={() => setTab('funnels')} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${tab === 'funnels' ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>Funnels</button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {tab === 'events' ? events.map((e) => (
            <div key={e.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <code className="text-xs font-mono text-cyan-400">{e.name}</code>
                <button onClick={() => setEvents((p) => p.filter((x) => x.id !== e.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">{e.trigger}</span>
                <span className="text-slate-300 font-mono">{e.count.toLocaleString()} events</span>
                <span className="text-emerald-400 font-mono">{e.conversionRate}%</span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 mt-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${e.conversionRate}%` }} /></div>
            </div>
          )) : funnels.map((f) => (
            <div key={f.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-200">{f.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-mono">{f.conversionRate}%</span>
                  <span className="text-xs text-red-400 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{f.dropoff}%</span>
                  <button onClick={() => setFunnels((p) => p.filter((x) => x.id !== f.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {f.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1 flex-1">
                    <div className="flex-1 text-center"><div className="text-[10px] text-slate-400 py-1 rounded bg-slate-800/50">{s}</div></div>
                    {i < f.steps.length - 1 && <div className="w-2 h-px bg-slate-700" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => tab === 'events' ? setEvents((p) => [...p, { id: crypto.randomUUID(), name: 'new_event', trigger: 'Custom', count: 0, conversionRate: 0 }]) : setFunnels((p) => [...p, { id: crypto.randomUUID(), name: 'New Funnel', steps: ['Step 1', 'Step 2'], conversionRate: 0, dropoff: 0 }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add {tab === 'events' ? 'event' : 'funnel'}</button>
        </div>
      </div>
    </div>
  );
}
