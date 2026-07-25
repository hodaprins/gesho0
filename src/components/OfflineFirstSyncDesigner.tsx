import { useState } from 'react';
import { CloudOff, X, ArrowRight, GitMerge, UserCheck, Database, Server, Layers } from 'lucide-react';

interface OfflineFirstSyncDesignerProps {
  open: boolean;
  onClose: () => void;
}

type ConflictStrategy = 'last-write-wins' | 'merge' | 'prompt';

interface SyncRule {
  entity: string;
  strategy: ConflictStrategy;
  queueTtl: string;
}

const INITIAL_RULES: SyncRule[] = [
  { entity: 'user_profile', strategy: 'last-write-wins', queueTtl: '24h' },
  { entity: 'cart_items', strategy: 'merge', queueTtl: '7d' },
  { entity: 'order_state', strategy: 'prompt', queueTtl: 'unlimited' },
  { entity: 'messages', strategy: 'merge', queueTtl: '30d' },
];

const STRATEGY_META: Record<ConflictStrategy, { label: string; icon: typeof GitMerge; color: string }> = {
  'last-write-wins': { label: 'Last-Write-Wins', icon: GitMerge, color: 'text-amber-400 bg-amber-500/15' },
  'merge': { label: 'Merge', icon: Layers, color: 'text-cyan-400 bg-cyan-500/15' },
  'prompt': { label: 'Prompt User', icon: UserCheck, color: 'text-violet-400 bg-violet-500/15' },
};

const FLOW = [
  { icon: Database, label: 'Local Queue', sub: 'IndexedDB / SQLite', color: 'text-cyan-400' },
  { icon: GitMerge, label: 'Conflict Resolution', sub: 'Strategy per entity', color: 'text-amber-400' },
  { icon: Server, label: 'Server Sync', sub: 'Push & pull deltas', color: 'text-emerald-400' },
];

export default function OfflineFirstSyncDesigner({ open, onClose }: OfflineFirstSyncDesignerProps) {
  const [rules, setRules] = useState<SyncRule[]>(INITIAL_RULES);
  if (!open) return null;

  const cycle = (idx: number) => {
    const order: ConflictStrategy[] = ['last-write-wins', 'merge', 'prompt'];
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, strategy: order[(order.indexOf(r.strategy) + 1) % order.length] } : r)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CloudOff className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Offline-First Sync Designer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Sync pipeline</p>
          <div className="flex items-center gap-2">
            {FLOW.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 flex-1">
                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-center">
                  <stage.icon className={`w-5 h-5 mx-auto mb-1 ${stage.color}`} />
                  <p className="text-xs font-semibold text-slate-200">{stage.label}</p>
                  <p className="text-[10px] text-slate-500">{stage.sub}</p>
                </div>
                {i < FLOW.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Sync rules — tap strategy to cycle</p>
          {rules.map((rule, i) => {
            const meta = STRATEGY_META[rule.strategy];
            return (
              <div key={rule.entity} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 font-mono truncate">{rule.entity}</p>
                  <p className="text-[10px] text-slate-500">queue TTL: {rule.queueTtl}</p>
                </div>
                <button onClick={() => cycle(i)} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${meta.color} transition-colors hover:opacity-80`}>
                  <meta.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">{meta.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
