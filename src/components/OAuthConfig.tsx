import { KeyRound, X, ArrowRight, Shield } from 'lucide-react';
import { useState } from 'react';

const GRANTS = ['Authorization Code', 'Authorization Code + PKCE', 'Client Credentials', 'Refresh Token'];
const SCOPES = ['openid', 'profile', 'email', 'offline_access', 'read:api', 'write:api'];

export default function OAuthConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [grant, setGrant] = useState(1);
  const [scopes, setScopes] = useState<Set<string>>(new Set(['openid', 'profile', 'email']));
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">OAuth 2.1 Configuration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Grant Type</h4><div className="space-y-1.5">{GRANTS.map((g, i) => <button key={g} onClick={() => setGrant(i)} className={`w-full flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${grant === i ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-800 bg-slate-950/40'}`}><div className={`w-4 h-4 rounded-full border-2 ${grant === i ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`} /><span className="text-xs text-slate-200">{g}</span></button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Scopes</h4><div className="flex flex-wrap gap-1.5">{SCOPES.map(s => <button key={s} onClick={() => setScopes(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; })} className={`text-xs px-2.5 py-1 rounded-full ${scopes.has(s) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>{s}</button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-cyan-400 font-medium mb-2 flex items-center gap-1.5"><Shield className="w-3 h-3" /> Auth Flow</h4>
            <div className="space-y-1.5 text-[10px]">
              {['Client → Auth Server (redirect)', 'User logs in & consents', 'Auth Server → Client (code)', 'Client → Token Endpoint (code + PKCE)', 'Token Endpoint → Client (access + refresh)'].map((step, i) => <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span><span className="text-slate-300">{step}</span></div>)}
            </div>
          </div>
          <div><label className="text-xs text-slate-500 mb-1 block">Redirect URI</label><input defaultValue="https://app.example.com/callback" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 font-mono" /></div>
        </div>
      </div>
    </div>
  );
}
