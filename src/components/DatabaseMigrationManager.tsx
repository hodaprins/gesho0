import { useState } from 'react';
import { Database, X, Plus, Check, Clock, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';

interface Migration {
  id: string;
  name: string;
  filename: string;
  status: 'applied' | 'pending' | 'failed';
  appliedAt: string;
  sql: string;
}

const INITIAL: Migration[] = [
  { id: '1', name: 'create_users_table', filename: '20260720_create_users.sql', status: 'applied', appliedAt: '2026-07-20 10:00', sql: 'CREATE TABLE users (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  email text UNIQUE NOT NULL,\n  name text,\n  created_at timestamptz DEFAULT now()\n);' },
  { id: '2', name: 'add_auth_tables', filename: '20260721_add_auth.sql', status: 'applied', appliedAt: '2026-07-21 14:30', sql: 'CREATE TABLE sessions (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid REFERENCES users(id),\n  token text NOT NULL,\n  expires_at timestamptz\n);' },
  { id: '3', name: 'add_orders_table', filename: '20260722_add_orders.sql', status: 'pending', appliedAt: '-', sql: 'CREATE TABLE orders (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid REFERENCES users(id),\n  total numeric(10,2),\n  status text DEFAULT \'pending\'\n);' },
  { id: '4', name: 'add_analytics_events', filename: '20260723_add_events.sql', status: 'pending', appliedAt: '-', sql: 'CREATE TABLE analytics_events (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  event text NOT NULL,\n  user_id uuid,\n  properties jsonb,\n  created_at timestamptz DEFAULT now()\n);' },
];

interface DatabaseMigrationManagerProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_META: Record<string, { color: string; icon: React.ReactNode }> = {
  applied: { color: 'bg-emerald-500/20 text-emerald-400', icon: <Check className="w-3 h-3" /> },
  pending: { color: 'bg-amber-500/20 text-amber-400', icon: <Clock className="w-3 h-3" /> },
  failed: { color: 'bg-red-500/20 text-red-400', icon: <X className="w-3 h-3" /> },
};

export default function DatabaseMigrationManager({ open, onClose }: DatabaseMigrationManagerProps) {
  const [migrations, setMigrations] = useState<Migration[]>(INITIAL);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  if (!open) return null;

  const runPending = () => {
    setRunning(true);
    setTimeout(() => {
      setMigrations((p) => p.map((m) => m.status === 'pending' ? { ...m, status: 'applied' as const, appliedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : m));
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Database Migrations</h3>
            <span className="text-xs text-slate-500">{migrations.filter(m => m.status === 'applied').length}/{migrations.length} applied</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1.5">
          {migrations.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
              <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/30 transition-colors">
                {expanded === m.id ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                <div className="flex-1 text-left">
                  <p className="text-sm font-mono text-slate-200">{m.name}</p>
                  <p className="text-[10px] text-slate-600 font-mono">{m.filename}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 capitalize ${STATUS_META[m.status].color}`}>{STATUS_META[m.status].icon}{m.status}</span>
                <span className="text-[10px] text-slate-600 font-mono w-32 text-right">{m.appliedAt}</span>
              </button>
              {expanded === m.id && (
                <div className="border-t border-slate-800 p-3">
                  <pre className="text-xs font-mono text-slate-400 leading-relaxed bg-[#0d1117] rounded-lg p-3 overflow-auto scrollbar-thin">{m.sql}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={runPending} disabled={running || !migrations.some(m => m.status === 'pending')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40">
            {running ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {running ? 'Running...' : `Run ${migrations.filter(m => m.status === 'pending').length} pending`}
          </button>
          <button onClick={() => setMigrations((p) => [...p, { id: crypto.randomUUID(), name: 'new_migration', filename: `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_new.sql`, status: 'pending' as const, appliedAt: '-', sql: '-- Add your SQL here' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> New migration</button>
        </div>
      </div>
    </div>
  );
}
