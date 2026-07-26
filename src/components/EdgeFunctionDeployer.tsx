import { Zap, X, Globe, Terminal } from 'lucide-react';
import { useState } from 'react';

const REGIONS = [
  { id: 'global', name: 'Global Edge', latency: '5ms', locations: 300 },
  { id: 'us-east', name: 'US East', latency: '12ms', locations: 45 },
  { id: 'eu-west', name: 'EU West', latency: '15ms', locations: 38 },
  { id: 'ap-southeast', name: 'AP Southeast', latency: '20ms', locations: 22 },
];

const RUNTIMES = ['Deno', 'Node.js', 'Bun', 'Workers'];

export default function EdgeFunctionDeployer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [region, setRegion] = useState('global');
  const [runtime, setRuntime] = useState('Deno');
  const [deployed, setDeployed] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Edge Function Deployer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Region</h4>
            <div className="grid grid-cols-2 gap-2">
              {REGIONS.map(r => <button key={r.id} onClick={() => setRegion(r.id)} className={`rounded-xl border p-3 text-left transition-colors ${region === r.id ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40'}`}><p className="text-xs text-slate-200">{r.name}</p><p className="text-[10px] text-slate-500">{r.locations} locations · {r.latency} avg</p></button>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Runtime</h4>
            <div className="flex items-center gap-1.5">{RUNTIMES.map(r => <button key={r} onClick={() => setRuntime(r)} className={`text-xs px-2.5 py-1 rounded-full ${runtime === r ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>{r}</button>)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-amber-400 font-medium mb-1 flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Deploy Log</h4>
            {deployed ? <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap">{`✓ Building function...\n✓ Uploading to ${REGIONS.find(r => r.id === region)?.name}...\n✓ Deployed to ${REGIONS.find(r => r.id === region)?.locations} edge locations\n✓ URL: https://edge.app/${region}/fn`}</pre> : <p className="text-[10px] text-slate-500">Ready to deploy</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><button onClick={() => { setDeployed(true); }} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-semibold"><Zap className="w-4 h-4" /> Deploy to Edge</button></div>
      </div>
    </div>
  );
}
