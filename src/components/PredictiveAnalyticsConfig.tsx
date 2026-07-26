import { TrendingUp, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const MODELS = [
  { id: 'churn', name: 'Churn Prediction', accuracy: 87, features: ['Usage frequency', 'Session length', 'Payment history'] },
  { id: 'ltv', name: 'Lifetime Value', accuracy: 82, features: ['Purchase frequency', 'Avg order value', 'Engagement score'] },
  { id: 'conversion', name: 'Conversion Rate', accuracy: 91, features: ['Onboarding completion', 'Feature usage', 'Referral source'] },
];

export default function PredictiveAnalyticsConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  if (!open) return null;
  const m = MODELS[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Predictive Analytics</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800"><div className="flex items-center gap-1.5">{MODELS.map((mdl, i) => <button key={mdl.id} onClick={() => setSelected(i)} className={`text-xs px-2.5 py-1 rounded-full ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{mdl.name}</button>)}</div></div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"><p className="text-3xl font-bold text-emerald-400">{m.accuracy}%</p><p className="text-xs text-slate-500">Model Accuracy (F1 Score)</p></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Feature Importance</h4><div className="space-y-1.5">{m.features.map((f, i) => <div key={f} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><BarChart3 className="w-3 h-3 text-emerald-400" /><span className="text-xs text-slate-300 flex-1">{f}</span><div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${90 - i * 20}%` }} /></div></div>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-emerald-400 font-medium mb-1">Training Configuration</h4><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">Training Data:</span><span className="text-slate-300">120K records</span></div><div className="flex justify-between"><span className="text-slate-500">Algorithm:</span><span className="text-slate-300">XGBoost + Deep Learning</span></div><div className="flex justify-between"><span className="text-slate-500">Retraining:</span><span className="text-slate-300">Weekly (automated)</span></div><div className="flex justify-between"><span className="text-slate-500">Inference:</span><span className="text-slate-300">Real-time (&lt; 50ms)</span></div></div></div>
        </div>
      </div>
    </div>
  );
}
