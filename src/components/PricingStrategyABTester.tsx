import { Tags, X, TrendingUp, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface Variant {
  id: string;
  price: number;
  conversion: number;
}

interface PricingStrategyABTesterProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL_VARIANTS: Variant[] = [
  { id: crypto.randomUUID(), price: 9, conversion: 8.2 },
  { id: crypto.randomUUID(), price: 14, conversion: 6.5 },
  { id: crypto.randomUUID(), price: 19, conversion: 4.1 },
];

export default function PricingStrategyABTester({ open, onClose }: PricingStrategyABTesterProps) {
  const [variants, setVariants] = useState<Variant[]>(INITIAL_VARIANTS);
  const [traffic, setTraffic] = useState(10000);

  if (!open) return null;

  const revenues = variants.map((v) => Math.round(traffic * (v.conversion / 100) * v.price));
  const maxRev = Math.max(...revenues, 1);
  const winnerIdx = revenues.indexOf(maxRev);

  const updateVariant = (id: string, field: 'price' | 'conversion', value: number) => {
    setVariants((p) => p.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Tags className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Pricing Strategy A/B Tester</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Monthly Traffic (visitors)</label><span className="text-xs font-mono text-slate-200">{traffic.toLocaleString()}</span></div><input type="range" min="1000" max="100000" step="1000" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="w-full accent-amber-500" /></div>

          <div className="space-y-2">
            {variants.map((v, i) => {
              const revenue = revenues[i];
              const isWinner = i === winnerIdx;
              return (
                <div key={v.id} className={`rounded-xl border p-3 ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">Variant {String.fromCharCode(65 + i)}</span>
                    {isWinner && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Best Revenue</span>}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1"><label className="text-[10px] text-slate-500 flex items-center gap-1 mb-0.5"><DollarSign className="w-2.5 h-2.5" /> Price ($)</label><input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', Number(e.target.value))} className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500" /></div>
                    <div className="flex-1"><label className="text-[10px] text-slate-500 flex items-center gap-1 mb-0.5"><TrendingUp className="w-2.5 h-2.5" /> Conv. (%)</label><input type="number" step="0.1" value={v.conversion} onChange={(e) => updateVariant(v.id, 'conversion', Number(e.target.value))} className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500" /></div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${isWinner ? 'bg-emerald-500' : 'bg-amber-500/70'}`} style={{ width: `${(revenue / maxRev) * 100}%` }} /></div>
                  <div className="flex items-center justify-between mt-1.5"><span className="text-[10px] text-slate-500">{Math.round(traffic * (v.conversion / 100)).toLocaleString()} customers</span><span className="text-xs font-bold text-slate-200">${revenue.toLocaleString()}/mo</span></div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
            <p className="text-xs text-slate-500">Recommended: <span className="text-emerald-400 font-semibold">Variant {String.fromCharCode(65 + winnerIdx)}</span> at ${variants[winnerIdx].price}/mo</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Max projected revenue ${maxRev.toLocaleString()}/month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
