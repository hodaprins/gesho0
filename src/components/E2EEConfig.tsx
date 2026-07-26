import { Lock, X, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function E2EEConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [algorithm, setAlgorithm] = useState<'AES-256-GCM' | 'ChaCha20-Poly1305'>('AES-256-GCM');
  const [rotation, setRotation] = useState(30);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Lock className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">End-to-End Encryption</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Encryption Algorithm</h4><div className="grid grid-cols-2 gap-2">{(['AES-256-GCM', 'ChaCha20-Poly1305'] as const).map(a => <button key={a} onClick={() => setAlgorithm(a)} className={`rounded-xl border p-3 text-center transition-colors ${algorithm === a ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/40'}`}><Lock className={`w-5 h-5 mx-auto mb-1 ${algorithm === a ? 'text-emerald-400' : 'text-slate-500'}`} /><p className="text-xs text-slate-200">{a}</p></button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1.5"><Key className="w-3 h-3" /> Key Exchange</h4><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">Protocol:</span><span className="text-slate-300">X25519 (ECDH)</span></div><div className="flex justify-between"><span className="text-slate-500">Key derivation:</span><span className="text-slate-300">HKDF-SHA256</span></div><div className="flex justify-between"><span className="text-slate-500">Ratchet:</span><span className="text-slate-300">Double Ratchet (Signal)</span></div></div></div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Key Rotation Period</label><span className="text-xs font-mono text-slate-200">{rotation} days</span></div><input type="range" min="1" max="90" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-emerald-500" /></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Security Checklist</h4><ul className="space-y-1">{[{ t: 'Keys never leave device', ok: true }, { t: 'Forward secrecy enabled', ok: true }, { t: 'Post-quantum ready (Kyber)', ok: false }, { t: 'Encrypted backup option', ok: true }].map(item => <li key={item.t} className="flex items-center gap-2 text-xs"><ShieldCheck className={`w-3 h-3 ${item.ok ? 'text-emerald-400' : 'text-amber-400'}`} /><span className={item.ok ? 'text-slate-300' : 'text-amber-400'}>{item.t}</span></li>)}</ul></div>
          <div className="grid grid-cols-3 gap-2"><div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-sm font-bold text-emerald-400">A+</p><p className="text-[10px] text-slate-500">Grade</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">256-bit</p><p className="text-[10px] text-slate-500">Key Size</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">0ms</p><p className="text-[10px] text-slate-500">Decrypt Latency</p></div></div>
        </div>
      </div>
    </div>
  );
}
