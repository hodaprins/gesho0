import { useState, useEffect } from 'react';
import { DatabaseZap, X, RefreshCw, Zap, TrendingUp, HardDrive, Clock, Activity } from 'lucide-react';

interface SmartCacheIndicatorProps {
  open: boolean;
  onClose: () => void;
}

interface CacheStat {
  hitRate: number;
  queries: number;
  size: string;
  lastInvalidated: string;
}

export default function SmartCacheIndicator({ open, onClose }: SmartCacheIndicatorProps) {
  const [stats, setStats] = useState<CacheStat>({ hitRate: 94.2, queries: 12847, size: '12.4 MB', lastInvalidated: '3 min ago' });
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    setStats((s) => ({
      ...s,
      hitRate: Math.min(99.9, Math.max(88, s.hitRate + (Math.random() - 0.45) * 0.8)),
      queries: s.queries + Math.floor(Math.random() * 50 + 10),
      size: `${(12.4 + Math.random() * 0.6).toFixed(1)} MB`,
    }));
  }, [tick]);

  if (!open) return null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setStats((s) => ({ ...s, lastInvalidated: 'just now', hitRate: 100, queries: 0 }));
    }, 1000);
  };

  const statCards = [
    { icon: TrendingUp, label: 'Hit Rate', value: `${stats.hitRate.toFixed(1)}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Activity, label: 'Cached Queries', value: stats.queries.toLocaleString(), color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: HardDrive, label: 'Cache Size', value: stats.size, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Clock, label: 'Last Invalidation', value: stats.lastInvalidated, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <DatabaseZap className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Smart Cache Status</h3>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-base font-semibold text-slate-100 font-mono mt-0.5">{s.value}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">Hit Rate Trend</span>
              <span className="text-[10px] text-emerald-400">▲ 2.1% this hour</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[60, 72, 68, 80, 85, 78, 90, 88, 94, 92, 96, 94].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/40 to-emerald-400" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-400 flex-1">Auto-refreshing every 3 seconds · cache warming enabled</span>
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Invalidate cache
          </button>
        </div>
      </div>
    </div>
  );
}
