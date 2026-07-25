import { useState } from 'react';
import { Grid3x3, X, Check, Minus } from 'lucide-react';

interface RolesPermissions {
  role: string;
  color: string;
  perms: Record<string, boolean>;
}

const PERMISSIONS = ['read', 'write', 'delete', 'deploy'] as const;
const ROLES: RolesPermissions[] = [
  { role: 'admin', color: 'text-red-400', perms: { read: true, write: true, delete: true, deploy: true } },
  { role: 'editor', color: 'text-cyan-400', perms: { read: true, write: true, delete: false, deploy: false } },
  { role: 'viewer', color: 'text-slate-400', perms: { read: true, write: false, delete: false, deploy: false } },
];

interface PermissionMatrixVisualizerProps {
  open: boolean;
  onClose: () => void;
}

export default function PermissionMatrixVisualizer({ open, onClose }: PermissionMatrixVisualizerProps) {
  const [matrix, setMatrix] = useState<RolesPermissions[]>(ROLES);
  const [hover, setHover] = useState<{ role: string; perm: string } | null>(null);
  if (!open) return null;

  const toggle = (roleIdx: number, perm: string) => {
    setMatrix((p) => p.map((r, i) => i === roleIdx ? { ...r, perms: { ...r.perms, [perm]: !r.perms[perm] } } : r));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Grid3x3 className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Permission Matrix Visualizer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4">
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-3 py-2.5 text-left text-[10px] uppercase text-slate-500 font-medium">Role</th>
                  {PERMISSIONS.map((p) => <th key={p} className="px-3 py-2.5 text-center text-[10px] uppercase text-slate-500 font-medium">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {matrix.map((r, ri) => (
                  <tr key={r.role} className="border-t border-slate-800">
                    <td className="px-3 py-3"><span className={`text-sm font-medium capitalize ${r.color}`}>{r.role}</span></td>
                    {PERMISSIONS.map((p) => (
                      <td key={p} className="px-3 py-3 text-center" onMouseEnter={() => setHover({ role: r.role, perm: p })} onMouseLeave={() => setHover(null)}>
                        <button onClick={() => toggle(ri, p)} className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${r.perms[p] ? 'bg-emerald-500/20 hover:bg-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700'}`}>
                          {r.perms[p] ? <Check className="w-4 h-4 text-emerald-400" /> : <Minus className="w-3.5 h-3.5 text-slate-600" />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-4 space-y-2">
          {matrix.map((r) => (
            <div key={r.role} className="flex items-center gap-2 text-xs">
              <span className={`capitalize font-medium ${r.color}`}>{r.role}</span>
              <span className="text-slate-500">·</span>
              <div className="flex items-center gap-1 flex-wrap">
                {PERMISSIONS.filter((p) => r.perms[p]).map((p) => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 capitalize">{p}</span>)}
                {PERMISSIONS.filter((p) => !r.perms[p]).map((p) => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 capitalize line-through">{p}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center px-5 py-3 border-t border-slate-800">
          {hover ? <span className="text-xs text-slate-400">{hover.role} → <span className="capitalize text-slate-200">{hover.perm}</span></span> : <span className="text-xs text-slate-500">Click a cell to toggle permissions</span>}
          <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold">Apply matrix</button>
        </div>
      </div>
    </div>
  );
}
