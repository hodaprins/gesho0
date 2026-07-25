import { DollarSign, X, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';

interface MonetizationModel {
  id: string;
  name: string;
  description: string;
  fitScore: number;
  potentialRevenue: string;
  pros: string[];
  cons: string[];
}

const MODELS: MonetizationModel[] = [
  { id: 'freemium', name: 'Freemium', description: 'Free core features, paid premium tier', fitScore: 85, potentialRevenue: '$2-5 ARPU', pros: ['Low barrier to entry', 'Viral growth potential', 'Predictable upgrade funnel'], cons: ['High free-to-paid conversion needed', 'Support costs for free users'] },
  { id: 'subscription', name: 'Subscription', description: 'Monthly/yearly recurring payment', fitScore: 78, potentialRevenue: '$5-15 ARPU', pros: ['Predictable revenue', 'High LTV', 'Enables continuous development'], cons: ['Churn risk', 'Need constant value delivery'] },
  { id: 'ads', name: 'Advertising', description: 'Show ads to free users', fitScore: 45, potentialRevenue: '$0.5-2 ARPU', pros: ['No payment friction', 'Scales with users'], cons: ['Low revenue per user', 'Hurts UX', 'Need high DAU'] },
  { id: 'iap', name: 'In-App Purchases', description: 'Sell digital goods/features', fitScore: 72, potentialRevenue: '$1-10 ARPU', pros: ['Flexible pricing', 'Impulse purchases', 'No commitment'], cons: ['Whale-dependent', 'Needs compelling virtual goods'] },
  { id: 'marketplace', name: 'Marketplace Fees', description: 'Take a cut from transactions', fitScore: 68, potentialRevenue: '5-15% GMV', pros: ['Scales with transaction volume', 'Aligned incentives'], cons: ['Need two-sided market', 'Chicken-and-egg problem'] },
  { id: 'b2b', name: 'B2B Licensing', description: 'Sell to businesses', fitScore: 60, potentialRevenue: '$50-500/seat', pros: ['High revenue per customer', 'Stable contracts'], cons: ['Long sales cycle', 'Custom support needs'] },
];

interface AIMonetizationStrategistProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function AIMonetizationStrategist({ open, onClose, appName }: AIMonetizationStrategistProps) {
  if (!open) return null;
  const topModel = MODELS[0];
  const projectedMonthly = 4200;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">AI Monetization Strategist</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-center gap-2 mb-1"><Lightbulb className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400 font-medium">Top Recommendation</span></div>
            <p className="text-sm text-slate-200">{topModel.name}: {topModel.description}</p>
            <div className="flex items-center gap-3 mt-2"><span className="text-xs text-slate-500">Fit Score: <span className="text-emerald-400 font-bold">{topModel.fitScore}%</span></span><span className="text-xs text-slate-500">Est: <span className="text-slate-200 font-bold">{topModel.potentialRevenue}</span></span></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {MODELS.map((m) => (
            <div key={m.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-200">{m.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.fitScore}%`, backgroundColor: m.fitScore > 70 ? '#10b981' : m.fitScore > 50 ? '#f59e0b' : '#64748b' }} /></div>
                  <span className="text-xs font-mono text-slate-400">{m.fitScore}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1">{m.description}</p>
              <p className="text-xs text-slate-400">Revenue: <span className="text-emerald-400 font-mono">{m.potentialRevenue}</span></p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>{m.pros.slice(0, 2).map((p) => <p key={p} className="text-[10px] text-emerald-400/70 flex items-start gap-1"><span className="text-emerald-400">+</span> {p}</p>)}</div>
                <div>{m.cons.slice(0, 2).map((c) => <p key={c} className="text-[10px] text-red-400/70 flex items-start gap-1"><span className="text-red-400">-</span> {c}</p>)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-slate-800/30 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Projected monthly revenue (1K users)</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" />${projectedMonthly.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
