import { Map, X, Target } from 'lucide-react';
import { useState } from 'react';

interface Competitor {
  id: string;
  name: string;
  price: number;
  features: number;
}

interface CompetitiveLandscapeMapperProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL_COMPETITORS: Competitor[] = [
  { id: crypto.randomUUID(), name: 'AcmeApp', price: 30, features: 60 },
  { id: crypto.randomUUID(), name: 'Zenith', price: 70, features: 85 },
  { id: crypto.randomUUID(), name: 'FlowBase', price: 15, features: 40 },
  { id: crypto.randomUUID(), name: 'Nimbus', price: 50, features: 70 },
  { id: crypto.randomUUID(), name: 'Our App', price: 25, features: 75 },
];

export default function CompetitiveLandscapeMapper({ open, onClose }: CompetitiveLandscapeMapperProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS);
  const [selected, setSelected] = useState<string | null>('Our App');

  if (!open) return null;

  const chartW = 420;
  const chartH = 280;
  const pad = 40;

  const xMap = (price: number) => pad + (price / 100) * (chartW - pad * 2);
  const yMap = (features: number) => chartH - pad - (features / 100) * (chartH - pad * 2);
  const selectedComp = competitors.find((c) => c.name === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Map className="w-5 h-5 text-teal-400" /><h3 className="text-sm font-semibold text-slate-100">Competitive Landscape Mapper</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="flex justify-center rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`}>
              <line x1={pad} y1={chartH - pad} x2={chartW - pad} y2={chartH - pad} stroke="#334155" strokeWidth="1.5" />
              <line x1={pad} y1={pad} x2={pad} y2={chartH - pad} stroke="#334155" strokeWidth="1.5" />
              <text x={chartW / 2} y={chartH - 8} textAnchor="middle" fontSize="11" fill="#64748b">Price →</text>
              <text x={12} y={chartH / 2} textAnchor="middle" fontSize="11" fill="#64748b" transform={`rotate(-90 12 ${chartH / 2})`}>Features →</text>
              <line x1={pad} y1={pad} x2={chartW - pad} y2={chartH - pad} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <text x={chartW - pad - 50} y={pad + 15} fontSize="9" fill="#475569">Premium</text>
              <text x={pad + 5} y={chartH - pad - 5} fontSize="9" fill="#475569">Budget</text>
              {competitors.map((c) => {
                const isUs = c.name === 'Our App';
                const isSel = c.name === selected;
                return (
                  <g key={c.id} className="cursor-pointer" onClick={() => setSelected(c.name)}>
                    <circle cx={xMap(c.price)} cy={yMap(c.features)} r={isUs ? 10 : 7} fill={isUs ? '#14b8a6' : isSel ? '#475569' : '#1e293b'} stroke={isUs || isSel ? '#14b8a6' : '#334155'} strokeWidth="2" />
                    <text x={xMap(c.price)} y={yMap(c.features) - 14} textAnchor="middle" fontSize="10" fill={isUs || isSel ? '#f1f5f9' : '#64748b'}>{c.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {competitors.map((c) => (
              <button key={c.id} onClick={() => setSelected(c.name)} className={`rounded-lg border p-2.5 text-left transition-colors ${c.name === selected ? 'border-teal-500/50 bg-teal-500/10' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/30'}`}>
                <div className="flex items-center gap-1.5"><Target className={`w-3 h-3 ${c.name === 'Our App' ? 'text-teal-400' : 'text-slate-500'}`} /><span className="text-xs font-medium text-slate-200">{c.name}</span></div>
                <div className="flex gap-3 mt-1 text-[10px] text-slate-500"><span>${c.price}/mo</span><span>{c.features} features</span></div>
              </button>
            ))}
          </div>

          {selectedComp && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-400"><span className="font-semibold text-slate-200">{selectedComp.name}</span> — ${selectedComp.price}/mo with {selectedComp.features} features. {selectedComp.name === 'Our App' ? 'Positioned with strong feature set at a competitive price.' : 'Adjust positioning to differentiate on price or features.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
