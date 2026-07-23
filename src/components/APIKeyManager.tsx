import { useState } from 'react';
import { Key, X, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string;
}

const INITIAL: APIKey[] = [
  { id: '1', name: 'Production API', key: 'af_pk_live_8a3f...d29c', created: '2026-07-20', lastUsed: '2m ago', permissions: 'read,write' },
  { id: '2', name: 'Mobile App', key: 'af_pk_live_2b7e...f81a', created: '2026-07-21', lastUsed: '5m ago', permissions: 'read,write' },
  { id: '3', name: 'Analytics Read-Only', key: 'af_pk_ro_9c1d...a44b', created: '2026-07-22', lastUsed: '1h ago', permissions: 'read' },
];

interface APIKeyManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function APIKeyManager({ open, onClose }: APIKeyManagerProps) {
  const [keys, setKeys] = useState<APIKey[]>(INITIAL);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Key className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">API Keys</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-200">{k.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">{k.permissions}</span>
                  <button onClick={() => setKeys((p) => p.filter((x) => x.id !== k.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono text-slate-400 truncate">{showKey === k.id ? k.key : k.key.replace(/./g, '•').slice(0, 20) + '...'}</code>
                <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-slate-500 hover:text-slate-300">{showKey === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                <button onClick={() => copy(k.key)} className="text-slate-500 hover:text-slate-300">{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}</button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-1"><span>Created: {k.created}</span><span>·</span><span>Last used: {k.lastUsed}</span></div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setKeys((p) => [...p, { id: crypto.randomUUID(), name: 'New Key', key: `af_pk_live_${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`, created: new Date().toISOString().slice(0, 10), lastUsed: 'Never', permissions: 'read' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Plus className="w-3.5 h-3.5" /> Generate new key</button>
        </div>
      </div>
    </div>
  );
}
