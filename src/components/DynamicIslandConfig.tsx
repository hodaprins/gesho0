import { Circle, X, Clock, Phone, Navigation, Activity } from 'lucide-react';
import { useState } from 'react';

const ACTIVITIES = [
  { id: 'timer', name: 'Timer', icon: <Clock className="w-3 h-3" />, color: 'text-amber-400' },
  { id: 'call', name: 'Phone Call', icon: <Phone className="w-3 h-3" />, color: 'text-green-400' },
  { id: 'nav', name: 'Navigation', icon: <Navigation className="w-3 h-3" />, color: 'text-blue-400' },
  { id: 'health', name: 'Health', icon: <Activity className="w-3 h-3" />, color: 'text-red-400' },
];

export default function DynamicIslandConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<'collapsed' | 'expanded' | 'minimal'>('expanded');
  const [activity, setActivity] = useState('timer');
  if (!open) return null;
  const current = ACTIVITIES.find(a => a.id === activity)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Circle className="w-5 h-5 text-slate-400" /><h3 className="text-sm font-semibold text-slate-100">Dynamic Island Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['collapsed', 'expanded', 'minimal'] as const).map(s => <button key={s} onClick={() => setState(s)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${state === s ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{s}</button>)}
            <div className="w-px h-4 bg-slate-700 mx-1" />
            {ACTIVITIES.map(a => <button key={a.id} onClick={() => setActivity(a.id)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${activity === a.id ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{a.icon} {a.name}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-sm bg-black rounded-3xl p-4">
              <div className="flex items-center justify-between text-white text-xs mb-4"><span>9:41</span><span>5G</span></div>
              <div className="flex justify-center mb-8">
                {state === 'collapsed' && <div className="w-28 h-8 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-1.5"><span className={current.color}>{current.icon}</span><span className="text-[10px] text-white">{current.name} active</span></div>}
                {state === 'expanded' && <div className="w-64 bg-black rounded-2xl border border-slate-800 p-3"><div className="flex items-center gap-2 mb-2"><span className={current.color}>{current.icon}</span><span className="text-xs text-white">{current.name}</span></div><div className="flex items-center justify-between"><span className="text-2xl font-bold text-white">12:34</span><div className="flex gap-1"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">⏸</div><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">⏹</div></div></div></div>}
                {state === 'minimal' && <div className="w-12 h-12 bg-black rounded-full border border-slate-800 flex items-center justify-center"><span className={current.color}>{current.icon}</span></div>}
              </div>
              <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-900" />)}</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-slate-400 mb-1">ActivityKit Configuration</h4>
            <code className="text-[10px] font-mono text-slate-500">ActivityConfiguration(for: TimerAttributes.self) {'{ ... }'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
