import { Award, X, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Keyword {
  id: string;
  term: string;
  difficulty: number;
  volume: number;
  rank: number;
}

interface AppStoreRankingPredictorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const INITIAL_KEYWORDS: Keyword[] = [
  { id: crypto.randomUUID(), term: 'task manager', difficulty: 78, volume: 54000, rank: 42 },
  { id: crypto.randomUUID(), term: 'to-do list', difficulty: 65, volume: 89000, rank: 28 },
  { id: crypto.randomUUID(), term: 'productivity planner', difficulty: 41, volume: 12000, rank: 9 },
  { id: crypto.randomUUID(), term: 'team collaboration', difficulty: 88, volume: 33000, rank: 156 },
  { id: crypto.randomUUID(), term: 'habit tracker', difficulty: 52, volume: 21000, rank: 17 },
];

export default function AppStoreRankingPredictor({ open, onClose, appName }: AppStoreRankingPredictorProps) {
  const [keywords, setKeywords] = useState<Keyword[]>(INITIAL_KEYWORDS);
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = keywords.filter((k) => k.term.toLowerCase().includes(query.toLowerCase()));
  const addKeyword = () => {
    if (!query.trim()) return;
    const diff = Math.floor(Math.random() * 60) + 30;
    setKeywords((p) => [...p, { id: crypto.randomUUID(), term: query.trim(), difficulty: diff, volume: Math.floor(Math.random() * 50000) + 5000, rank: Math.floor(Math.random() * 200) + 1 }]);
    setQuery('');
  };

  const rankColor = (rank: number) => rank <= 10 ? 'text-emerald-400' : rank <= 50 ? 'text-amber-400' : 'text-slate-500';
  const diffColor = (d: number) => d < 40 ? 'bg-emerald-500' : d < 70 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400" /><h3 className="text-sm font-semibold text-slate-100">App Store Ranking — {appName}</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addKeyword()} placeholder="Add keyword..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500" /></div>
            <button onClick={addKeyword} className="px-3 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs hover:bg-yellow-500/30">Add</button>
          </div>

          <div className="space-y-1.5">
            {filtered.map((k) => (
              <div key={k.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200">{k.term}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />{k.volume.toLocaleString()}</span>
                    <span className={`text-sm font-bold ${rankColor(k.rank)}`}>#{k.rank}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 w-16">Difficulty</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${diffColor(k.difficulty)}`} style={{ width: `${k.difficulty}%` }} /></div>
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{k.difficulty}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">{k.rank <= 10 ? 'Top 10 — high visibility' : k.rank <= 50 ? 'Top 50 — moderate traffic' : 'Beyond top 50 — needs optimization'}</p>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-xs text-slate-500 text-center py-6">No keywords found</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
