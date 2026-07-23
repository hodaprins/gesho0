import { useState } from 'react';
import { Globe, X, Check, Plus, Trash2, RefreshCw } from 'lucide-react';

interface Domain {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'failed';
  ssl: 'active' | 'pending' | 'none';
  primary: boolean;
}

const INITIAL: Domain[] = [
  { id: '1', domain: 'myapp.appforge.dev', status: 'active', ssl: 'active', primary: true },
  { id: '2', domain: 'www.myapp.com', status: 'pending', ssl: 'pending', primary: false },
  { id: '3', domain: 'staging.myapp.com', status: 'active', ssl: 'active', primary: false },
];

interface CustomDomainConfigProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const STATUS_META: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Active' },
  pending: { color: 'bg-amber-500/20 text-amber-400', label: 'Pending' },
  failed: { color: 'bg-red-500/20 text-red-400', label: 'Failed' },
};

export default function CustomDomainConfig({ open, onClose, appName }: CustomDomainConfigProps) {
  const [domains, setDomains] = useState<Domain[]>(INITIAL);
  const [newDomain, setNewDomain] = useState('');
  if (!open) return null;

  const add = () => {
    if (!newDomain.trim()) return;
    setDomains((p) => [...p, { id: crypto.randomUUID(), domain: newDomain, status: 'pending' as const, ssl: 'pending' as const, primary: false }]);
    setNewDomain('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Custom Domains</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {domains.map((d) => (
            <div key={d.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {d.primary && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">Primary</span>}
                  <code className="text-sm font-mono text-slate-200">{d.domain}</code>
                </div>
                <button onClick={() => setDomains((p) => p.filter((x) => x.id !== d.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_META[d.status].color}`}>{d.status === 'active' && <Check className="w-2.5 h-2.5" />}{STATUS_META[d.status].label}</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">SSL: <span className={d.ssl === 'active' ? 'text-emerald-400' : d.ssl === 'pending' ? 'text-amber-400' : 'text-slate-600'}>{d.ssl}</span></span>
                {d.status === 'pending' && <button className="text-[10px] text-cyan-400 flex items-center gap-1 ml-auto"><RefreshCw className="w-2.5 h-2.5" />Verify</button>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <Globe className="w-4 h-4 text-slate-500" />
          <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Add domain (e.g. myapp.com)" className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:outline-none" />
          <button onClick={add} disabled={!newDomain.trim()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-40"><Plus className="w-3.5 h-3.5" /> Add</button>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/30">
          <p className="text-[10px] text-slate-500 mb-1">DNS Configuration:</p>
          <div className="rounded-lg bg-slate-900 p-2 font-mono text-[10px] text-slate-400 space-y-0.5">
            <p>A record: @ → 76.76.21.21</p>
            <p>CNAME: www → cname.appforge.dev</p>
          </div>
        </div>
      </div>
    </div>
  );
}
