import { useState } from 'react';
import { Gauge, X, Plus, Trash2, Save } from 'lucide-react';

interface RateLimitRule {
  id: string;
  path: string;
  method: string;
  limit: number;
  window: string;
  strategy: 'ip' | 'user' | 'token';
}

const INITIAL: RateLimitRule[] = [
  { id: '1', path: '/api/auth/login', method: 'POST', limit: 5, window: '1m', strategy: 'ip' },
  { id: '2', path: '/api/auth/signup', method: 'POST', limit: 3, window: '1h', strategy: 'ip' },
  { id: '3', path: '/api/*', method: 'GET', limit: 100, window: '1m', strategy: 'user' },
  { id: '4', path: '/api/uploads', method: 'POST', limit: 10, window: '1m', strategy: 'user' },
  { id: '5', path: '/api/password-reset', method: 'POST', limit: 3, window: '1h', strategy: 'ip' },
];

interface RateLimitConfigProps {
  open: boolean;
  onClose: () => void;
}

export default function RateLimitConfig({ open, onClose }: RateLimitConfigProps) {
  const [rules, setRules] = useState<RateLimitRule[]>(INITIAL);
  if (!open) return null;

  const remove = (id: string) => setRules((p) => p.filter((r) => r.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Gauge className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Rate Limiting</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-400">{r.method}</span>
                <code className="text-xs font-mono text-slate-200 flex-1 truncate">{r.path}</code>
                <button onClick={() => remove(r.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-300"><strong className="text-emerald-400">{r.limit}</strong> requests</span>
                <span className="text-slate-500">per {r.window}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-500 capitalize">by {r.strategy}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setRules((p) => [...p, { id: crypto.randomUUID(), path: '/api/new', method: 'GET', limit: 60, window: '1m', strategy: 'user' as const }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add rule</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold ml-auto"><Save className="w-3.5 h-3.5" /> Save config</button>
        </div>
      </div>
    </div>
  );
}
