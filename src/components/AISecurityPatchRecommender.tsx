import { useState } from 'react';
import { ShieldAlert, X, ArrowUpCircle, Check, ExternalLink, Loader2 } from 'lucide-react';

interface Patch {
  id: string;
  package: string;
  current: string;
  patched: string;
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  updated: boolean;
}

const SEV_BADGE: Record<string, string> = { critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-slate-500/20 text-slate-400' };

interface AISecurityPatchRecommenderProps {
  open: boolean;
  onClose: () => void;
}

export default function AISecurityPatchRecommender({ open, onClose }: AISecurityPatchRecommenderProps) {
  const [patches, setPatches] = useState<Patch[]>([
    { id: '1', package: 'axios', current: '1.6.2', patched: '1.7.4', cve: 'CVE-2024-39338', severity: 'high', updated: false },
    { id: '2', package: 'lodash', current: '4.17.20', patched: '4.17.21', cve: 'CVE-2021-23337', severity: 'high', updated: false },
    { id: '3', package: 'next', current: '14.0.3', patched: '14.2.5', cve: 'CVE-2024-34351', severity: 'critical', updated: false },
    { id: '4', package: 'ws', current: '8.11.0', patched: '8.17.1', cve: 'CVE-2024-37890', severity: 'medium', updated: false },
    { id: '5', package: 'semver', current: '7.5.2', patched: '7.6.2', cve: 'CVE-2024-4028', severity: 'low', updated: false },
  ]);
  const [updating, setUpdating] = useState<string | null>(null);
  if (!open) return null;

  const updateOne = (id: string) => {
    setUpdating(id);
    setTimeout(() => { setPatches((p) => p.map((x) => x.id === id ? { ...x, updated: true } : x)); setUpdating(null); }, 1200);
  };
  const updateAll = () => { setUpdating('all'); setTimeout(() => { setPatches((p) => p.map((x) => ({ ...x, updated: true }))); setUpdating(null); }, 2000); };

  const remaining = patches.filter((p) => !p.updated).length;
  const patched = patches.length - remaining;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">AI Security Patch Recommender</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
          <span className="text-xs text-slate-400">{remaining} patches pending</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden ml-2">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500" style={{ width: `${(patched / patches.length) * 100}%` }} />
          </div>
          <span className="text-xs text-emerald-400">{patched}/{patches.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {patches.map((p) => (
            <div key={p.id} className={`rounded-xl border p-3 transition-all ${p.updated ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${SEV_BADGE[p.severity]}`}>{p.severity}</span>
                <p className="text-sm font-mono font-medium text-slate-200 flex-1">{p.package}</p>
                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 hover:text-cyan-400">{p.cve}<ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono mb-2.5">
                <span className="text-red-400 line-through">{p.current}</span>
                <ArrowUpCircle className="w-3 h-3 text-slate-600" />
                <span className="text-emerald-400">{p.patched}</span>
              </div>
              <button onClick={() => updateOne(p.id)} disabled={p.updated || updating !== null} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed">
                {p.updated ? <span className="inline-flex items-center gap-1.5 text-emerald-400"><Check className="w-3.5 h-3.5" />Patched</span> : updating === p.id ? <span className="inline-flex items-center gap-1.5 text-cyan-400"><Loader2 className="w-3.5 h-3.5 animate-spin" />Updating…</span> : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"><ArrowUpCircle className="w-3.5 h-3.5" />Update to {p.patched}</span>}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={updateAll} disabled={remaining === 0 || updating !== null} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-slate-900 text-xs font-semibold disabled:opacity-40">
            {updating === 'all' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {remaining === 0 ? 'All patched' : updating === 'all' ? 'Patching all…' : `Patch all (${remaining})`}
          </button>
        </div>
      </div>
    </div>
  );
}
