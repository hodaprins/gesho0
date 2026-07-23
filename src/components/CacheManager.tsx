import { Zap, X, RotateCw, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface CacheEntry {
  id: string;
  key: string;
  value: string;
  ttl: number;
  hits: number;
  size: string;
}

const INITIAL: CacheEntry[] = [
  { id: '1', key: 'user_profile:a1b2c3', value: '{"name":"John","role":"admin"}', ttl: 300, hits: 1240, size: '1.2 KB' },
  { id: '2', key: 'product_list:page_1', value: '[{"id":"prod-1",...}]', ttl: 60, hits: 3400, size: '8.4 KB' },
  { id: '3', key: 'analytics:daily:20260723', value: '{"views":12480,...}', ttl: 3600, hits: 89, size: '2.1 KB' },
  { id: '4', key: 'config:feature_flags', value: '{"dark_mode":true,...}', ttl: 600, hits: 560, size: '0.8 KB' },
  { id: '5', key: 'session:d4e5f6', value: '{"token":"xxx","exp":...}', ttl: 1800, hits: 230, size: '0.5 KB' },
];

interface CacheManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function CacheManager({ open, onClose }: CacheManagerProps) {
  const [entries, setEntries] = useState<CacheEntry[]>(INITIAL);
  const [flushing, setFlushing] = useState(false);
  if (!open) return null;

  const hitRate = 87.3;
  const totalSize = '13.0 KB';

  const flush = () => { setFlushing(true); setTimeout(() => { setEntries([]); setFlushing(false); }, 800); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Cache Manager</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{hitRate}%</p><p className="text-[10px] text-slate-500 flex items-center justify-center gap-1"><TrendingUp className="w-2.5 h-2.5" /> Hit Rate</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{entries.length}</p><p className="text-[10px] text-slate-500">Keys</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{totalSize}</p><p className="text-[10px] text-slate-500">Memory</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1.5">
          {entries.map((e) => (
            <div key={e.id} className="group flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <code className="text-xs font-mono text-slate-200 block truncate">{e.key}</code>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                  <span>TTL: {e.ttl}s</span><span>·</span><span>{e.hits} hits</span><span>·</span><span>{e.size}</span>
                </div>
              </div>
              <button onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          {entries.length === 0 && <div className="text-center py-8 text-sm text-slate-600">Cache is empty</div>}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={flush} disabled={flushing || entries.length === 0} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 disabled:opacity-40">
            {flushing ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />} {flushing ? 'Flushing...' : 'Flush all'}
          </button>
        </div>
      </div>
    </div>
  );
}
