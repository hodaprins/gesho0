import { KeyRound, X, Plus, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';

interface Keystore { id: string; name: string; alias: string; validity: string; sha256: string; }

const INITIAL: Keystore[] = [
  { id: '1', name: 'production.keystore', alias: 'prod-key', validity: '25 years', sha256: 'A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78' },
  { id: '2', name: 'staging.keystore', alias: 'staging-key', validity: '10 years', sha256: 'F0:EF:DE:CD:BC:9A:78:56:34:12:F0:DE:BC:9A:78:56:34:12:F0:DE:BC:9A:78:56:34:12:F0:DE:BC:9A' },
];

export default function AndroidKeystoreManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stores, setStores] = useState<Keystore[]>(INITIAL);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Android Keystore Manager</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {stores.map((ks) => (
            <div key={ks.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-amber-400" /><span className="text-sm font-medium text-slate-200">{ks.name}</span></div>
                <button onClick={() => setStores((p) => p.filter((x) => x.id !== ks.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">Alias: </span><span className="text-slate-300 font-mono">{ks.alias}</span></div>
                <div><span className="text-slate-500">Validity: </span><span className="text-slate-300">{ks.validity}</span></div>
              </div>
              <div className="mt-2"><span className="text-[10px] text-slate-500">SHA-256:</span><code className="block text-[9px] font-mono text-amber-400/70 mt-0.5 break-all">{ks.sha256}</code></div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setStores((p) => [...p, { id: crypto.randomUUID(), name: 'new.keystore', alias: 'upload', validity: '25 years', sha256: 'XX:XX' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium"><Plus className="w-3.5 h-3.5" /> Generate Keystore</button>
        </div>
      </div>
    </div>
  );
}
