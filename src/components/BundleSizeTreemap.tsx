import { Box, X, AlertTriangle } from 'lucide-react';

interface BundleSizeTreemapProps {
  open: boolean;
  onClose: () => void;
}

interface TreeNode {
  name: string;
  kb: number;
  color: string;
  children?: TreeNode[];
}

const TREE: TreeNode[] = [
  { name: 'react', kb: 142, color: 'bg-cyan-500/70' },
  { name: 'vendor', kb: 280, color: 'bg-violet-500/70', children: [
    { name: 'lodash', kb: 72, color: 'bg-violet-400/60' }, { name: 'date-fns', kb: 58, color: 'bg-violet-400/50' },
    { name: 'icons', kb: 150, color: 'bg-violet-400/70' },
  ]},
  { name: 'app', kb: 210, color: 'bg-emerald-500/70', children: [
    { name: 'screens', kb: 95, color: 'bg-emerald-400/60' }, { name: 'components', kb: 70, color: 'bg-emerald-400/50' },
    { name: 'utils', kb: 45, color: 'bg-emerald-400/40' },
  ]},
  { name: 'moment', kb: 240, color: 'bg-rose-500/70' },
];

export default function BundleSizeTreemap({ open, onClose }: BundleSizeTreemapProps) {
  if (!open) return null;
  const total = TREE.reduce((s, n) => s + n.kb, 0);
  const warnings: string[] = [];
  const moment = TREE.find((n) => n.name === 'moment');
  if (moment && moment.kb > 200) warnings.push(`'moment' is ${moment.kb} KB — replace with date-fns to save ~180 KB`);
  const icons = TREE.find((n) => n.name === 'vendor')?.children?.find((c) => c.name === 'icons');
  if (icons && icons.kb > 120) warnings.push(`Icon bundle is ${icons.kb} KB — enable tree-shaking or per-icon imports`);

  const totalArea = 10000;
  const layout = TREE.map((n) => ({ ...n, frac: n.kb / total, area: (n.kb / total) * totalArea }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Bundle Size Treemap</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{(total / 1024).toFixed(2)}</p><p className="text-[10px] text-slate-500">Total MB</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{TREE.length}</p><p className="text-[10px] text-slate-500">Top modules</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className={`text-lg font-bold ${total > 500 ? 'text-rose-400' : 'text-emerald-400'}`}>{total > 500 ? 'Over' : 'OK'}</p><p className="text-[10px] text-slate-500">Budget 500KB</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-800/30 border border-slate-800 p-3" style={{ minHeight: 140 }}>
            {layout.map((node) => (
              <div key={node.name} className={`relative rounded-lg ${node.color} p-2 flex flex-col justify-between overflow-hidden`}
                style={{ width: `${Math.max(node.frac * 100, 8)}%`, minWidth: 70, minHeight: 90 }}>
                <div>
                  <p className="text-[10px] font-semibold text-white/90 truncate">{node.name}</p>
                  <p className="text-[9px] text-white/70 font-mono">{node.kb} KB</p>
                </div>
                {node.children && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {node.children.map((c) => (
                      <div key={c.name} className={`rounded ${c.color} px-1 py-0.5`} style={{ width: `${(c.kb / node.kb) * 100}%`, minWidth: 28 }}>
                        <p className="text-[8px] text-white/80 truncate">{c.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Module breakdown</p>
            {TREE.map((n) => (
              <div key={n.name} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-20 truncate font-mono">{n.name}</span>
                <div className="flex-1 h-3 rounded bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded ${n.color}`} style={{ width: `${(n.kb / total) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400 font-mono w-14 text-right">{n.kb} KB</span>
                <span className="text-[10px] text-slate-600 w-10 text-right">{Math.round((n.kb / total) * 100)}%</span>
              </div>
            ))}
          </div>

          {warnings.length > 0 && (
            <div className="space-y-1.5">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/80">{w}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
