import { useState } from 'react';
import { KeyRound, X, Plus, Trash2, Eye, EyeOff, Check } from 'lucide-react';

interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  environment: 'dev' | 'staging' | 'prod';
}

const INITIAL: EnvVar[] = [
  { id: '1', key: 'API_URL', value: 'https://api.example.com', isSecret: false, environment: 'prod' },
  { id: '2', key: 'DATABASE_URL', value: 'postgres://••••••••', isSecret: true, environment: 'prod' },
  { id: '3', key: 'STRIPE_SECRET', value: 'sk_live_••••••••', isSecret: true, environment: 'prod' },
  { id: '4', key: 'DEBUG_MODE', value: 'true', isSecret: false, environment: 'dev' },
  { id: '5', key: 'SENTRY_DSN', value: 'https://••••@sentry.io', isSecret: true, environment: 'staging' },
];

interface EnvVarsManagerProps {
  open: boolean;
  onClose: () => void;
}

const ENV_COLORS: Record<string, string> = { dev: 'bg-emerald-500/20 text-emerald-400', staging: 'bg-amber-500/20 text-amber-400', prod: 'bg-red-500/20 text-red-400' };

export default function EnvVarsManager({ open, onClose }: EnvVarsManagerProps) {
  const [vars, setVars] = useState<EnvVar[]>(INITIAL);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  if (!open) return null;

  const toggleShow = (id: string) => setShowValues((p) => ({ ...p, [id]: !p[id] }));
  const remove = (id: string) => setVars((p) => p.filter((v) => v.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Environment Variables</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1.5">
          {vars.map((v) => (
            <div key={v.id} className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-300">{v.key}</code>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${ENV_COLORS[v.environment]}`}>{v.environment}</span>
                  {v.isSecret && <KeyRound className="w-3 h-3 text-amber-400" />}
                </div>
                <code className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate">{showValues[v.id] ? v.value : '••••••••••••'}</code>
              </div>
              <button onClick={() => toggleShow(v.id)} className="text-slate-500 hover:text-slate-300">{showValues[v.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              <button onClick={() => remove(v.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setVars((p) => [...p, { id: crypto.randomUUID(), key: 'NEW_VAR', value: '', isSecret: false, environment: 'dev' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add variable</button>
          <span className="text-xs text-slate-500">{vars.filter(v => v.isSecret).length} secrets</span>
        </div>
      </div>
    </div>
  );
}
