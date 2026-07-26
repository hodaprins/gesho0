import { Cpu, X, Layers, Wifi, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

const STRATEGIES = [
  { id: 'cf', name: 'Cache First', desc: 'Serve from cache, fallback to network', icon: Layers },
  { id: 'nf', name: 'Network First', desc: 'Try network, fallback to cache', icon: Wifi },
  { id: 'swr', name: 'Stale While Revalidate', desc: 'Serve cache, update in background', icon: Cpu },
];

const PRECACHE = ['/index.html', '/styles.css', '/app.js', '/offline.html', '/icons/icon-192.png'];

export default function ServiceWorkerManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [strategy, setStrategy] = useState('swr');
  const [cache, setCache] = useState(PRECACHE);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Cpu className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">Service Worker Manager</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Cache Strategy</h4>
            <div className="space-y-2">
              {STRATEGIES.map(s => (
                <button key={s.id} onClick={() => setStrategy(s.id)} className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${strategy === s.id ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
                  <s.icon className={`w-4 h-4 ${strategy === s.id ? 'text-orange-400' : 'text-slate-500'}`} />
                  <div><p className="text-xs text-slate-200">{s.name}</p><p className="text-[10px] text-slate-500">{s.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Precache List ({cache.length})</h4>
            <div className="space-y-1.5">
              {cache.map(url => (
                <div key={url} className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><Layers className="w-3 h-3 text-slate-500" /><code className="text-xs text-slate-300 flex-1 font-mono">{url}</code><button onClick={() => setCache(c => c.filter(u => u !== url))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button></div>
              ))}
            </div>
            <button onClick={() => setCache(c => [...c, '/new-resource.js'])} className="mt-2 inline-flex items-center gap-1.5 text-xs text-orange-400"><Plus className="w-3.5 h-3.5" /> Add resource</button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><p className="text-xs text-slate-400">Runtime Caching</p><code className="text-[10px] font-mono text-slate-500">{`workbox.routing.registerRoute(/\\/api\\//, new NetworkFirst())`}</code></div>
        </div>
      </div>
    </div>
  );
}
