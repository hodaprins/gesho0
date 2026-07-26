import { ShieldCheck, X, ArrowRight, KeyRound, Check } from 'lucide-react';
import { useState } from 'react';

export default function AppAttestationConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [env, setEnv] = useState<'dev' | 'prod'>('dev');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">App Attestation Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['dev', 'prod'] as const).map(e => <button key={e} onClick={() => setEnv(e)} className={`text-xs px-2.5 py-1 rounded-full uppercase ${env === e ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{e}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-xs text-emerald-400 font-medium mb-3">Attestation Flow</h4>
            <div className="space-y-2">
              {[
                { t: 'Generate Key', c: 'DCAppAttestService.generateKey()', d: 'Create cryptographic key on device' },
                { t: 'Request Challenge', c: 'server → nonce', d: 'Server sends unique challenge' },
                { t: 'Attest Key', c: 'DCAppAttestService.attestKey(key, challenge)', d: 'Apple validates device & app integrity' },
                { t: 'Generate Assertion', c: 'DCAppAttestService.generateAssertion(key, data)', d: 'Prove identity for future requests' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>{i < 3 && <div className="w-px h-8 bg-slate-700 mt-1" />}</div>
                  <div className="pb-3"><p className="text-sm text-slate-200">{s.t}</p><code className="text-[10px] text-emerald-400 font-mono">{s.c}</code><p className="text-[10px] text-slate-500 mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-slate-400 mb-2">Security Checklist</h4>
            <ul className="space-y-1">{[{ t: 'App Attest capability enabled', ok: true }, { t: 'App ID registered in Developer Portal', ok: true }, { t: 'Server-side validation configured', ok: env === 'prod' }, { t: 'Hardware-backed key storage', ok: true }].map(item => <li key={item.t} className="flex items-center gap-2 text-xs">{item.ok ? <Check className="w-3 h-3 text-emerald-400" /> : <KeyRound className="w-3 h-3 text-amber-400" />}<span className={item.ok ? 'text-slate-300' : 'text-amber-400'}>{item.t}</span></li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
