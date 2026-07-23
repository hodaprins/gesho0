import { ScrollText, X, Search } from 'lucide-react';
import { useState } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

const ENTRIES: AuditEntry[] = [
  { id: '1', timestamp: '2026-07-23 14:32:10', actor: 'admin@appforge.dev', action: 'DEPLOY', resource: 'production', ip: '203.0.113.42', severity: 'critical' },
  { id: '2', timestamp: '2026-07-23 14:15:22', actor: 'sarah@example.com', action: 'UPDATE', resource: 'feature_flags/new_checkout', ip: '198.51.100.12', severity: 'warning' },
  { id: '3', timestamp: '2026-07-23 13:45:00', actor: 'mike@example.com', action: 'CREATE', resource: 'screens/profile_v2', ip: '198.51.100.88', severity: 'info' },
  { id: '4', timestamp: '2026-07-23 12:20:15', actor: 'admin@appforge.dev', action: 'DELETE', resource: 'env_vars/OLD_API_KEY', ip: '203.0.113.42', severity: 'warning' },
  { id: '5', timestamp: '2026-07-23 11:08:30', actor: 'system', action: 'BACKUP', resource: 'database_snapshot', ip: '10.0.0.1', severity: 'info' },
  { id: '6', timestamp: '2026-07-23 10:00:00', actor: 'lisa@example.com', action: 'LOGIN', resource: 'auth/session', ip: '192.0.2.55', severity: 'info' },
  { id: '7', timestamp: '2026-07-23 09:30:45', actor: 'admin@appforge.dev', action: 'INVITE', resource: 'team/lisa@example.com', ip: '203.0.113.42', severity: 'warning' },
  { id: '8', timestamp: '2026-07-22 18:15:00', actor: 'system', action: 'MIGRATION', resource: 'db/add_orders_table', ip: '10.0.0.1', severity: 'critical' },
];

const SEV_COLORS: Record<string, string> = { info: 'text-slate-400', warning: 'text-amber-400', critical: 'text-red-400' };
const ACTION_COLORS: Record<string, string> = { DEPLOY: 'bg-red-500/20 text-red-400', DELETE: 'bg-red-500/20 text-red-400', CREATE: 'bg-emerald-500/20 text-emerald-400', UPDATE: 'bg-amber-500/20 text-amber-400', LOGIN: 'bg-cyan-500/20 text-cyan-400', INVITE: 'bg-cyan-500/20 text-cyan-400', BACKUP: 'bg-slate-700 text-slate-400', MIGRATION: 'bg-amber-500/20 text-amber-400' };

interface AuditTrailPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AuditTrailPanel({ open, onClose }: AuditTrailPanelProps) {
  const [search, setSearch] = useState('');
  if (!open) return null;
  const filtered = ENTRIES.filter((e) => e.actor.includes(search.toLowerCase()) || e.action.toLowerCase().includes(search.toLowerCase()) || e.resource.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ScrollText className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Audit Trail</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-2 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by actor, action, or resource..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((e) => (
            <div key={e.id} className="flex items-start gap-3 px-5 py-2.5 border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: e.severity === 'critical' ? '#ef4444' : e.severity === 'warning' ? '#f59e0b' : '#64748b' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${ACTION_COLORS[e.action] ?? 'bg-slate-700 text-slate-400'}`}>{e.action}</span>
                  <code className="text-xs text-slate-300 font-mono truncate">{e.resource}</code>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-600 mt-0.5">
                  <span>{e.actor}</span><span>·</span><span className="font-mono">{e.ip}</span><span>·</span><span>{e.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
