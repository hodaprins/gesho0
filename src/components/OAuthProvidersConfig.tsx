import { useState } from 'react';
import { KeyRound, X, Check, Plus } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  clientId: string;
  icon: string;
  color: string;
}

const INITIAL: Provider[] = [
  { id: 'google', name: 'Google', enabled: true, clientId: 'xxxxx.apps.googleusercontent.com', icon: 'G', color: 'bg-red-500/20 text-red-400' },
  { id: 'apple', name: 'Apple', enabled: true, clientId: 'com.myapp.signin', icon: '', color: 'bg-slate-700 text-slate-300' },
  { id: 'github', name: 'GitHub', enabled: false, clientId: '', icon: '', color: 'bg-slate-800 text-slate-400' },
  { id: 'facebook', name: 'Facebook', enabled: false, clientId: '', icon: 'f', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'twitter', name: 'Twitter/X', enabled: false, clientId: '', icon: 'X', color: 'bg-slate-700 text-slate-300' },
  { id: 'microsoft', name: 'Microsoft', enabled: false, clientId: '', icon: 'M', color: 'bg-cyan-500/20 text-cyan-400' },
];

interface OAuthProvidersConfigProps {
  open: boolean;
  onClose: () => void;
}

export default function OAuthProvidersConfig({ open, onClose }: OAuthProvidersConfigProps) {
  const [providers, setProviders] = useState<Provider[]>(INITIAL);
  if (!open) return null;

  const toggle = (id: string) => setProviders((p) => p.map((pr) => pr.id === id ? { ...pr, enabled: !pr.enabled } : pr));
  const update = (id: string, clientId: string) => setProviders((p) => p.map((pr) => pr.id === id ? { ...pr, clientId } : pr));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">OAuth Providers</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {providers.map((p) => (
            <div key={p.id} className={`rounded-xl border p-3 transition-colors ${p.enabled ? 'border-slate-700 bg-slate-950/40' : 'border-slate-800 bg-slate-950/20'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${p.color}`}>{p.icon || p.name.charAt(0)}</div>
                <span className="text-sm font-medium text-slate-200 flex-1">{p.name}</span>
                <button onClick={() => toggle(p.id)} className={`relative w-9 h-5 rounded-full transition-colors ${p.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {p.enabled && (
                <input value={p.clientId} onChange={(e) => update(p.id, e.target.value)} placeholder="Client ID" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{providers.filter(p => p.enabled).length} providers enabled</span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 ml-auto"><Check className="w-3 h-3" />Email/Password always enabled</span>
        </div>
      </div>
    </div>
  );
}
