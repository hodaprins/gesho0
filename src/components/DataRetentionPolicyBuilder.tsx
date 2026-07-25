import { useState } from 'react';
import { Archive, X, Clock, Trash2, ToggleLeft, ToggleRight, Plus, Save, Calendar } from 'lucide-react';

interface RetentionRule {
  id: string;
  dataType: string;
  period: string;
  days: number;
  autoDelete: boolean;
  icon: React.ReactNode;
}

interface DataRetentionPolicyBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function DataRetentionPolicyBuilder({ open, onClose }: DataRetentionPolicyBuilderProps) {
  const [rules, setRules] = useState<RetentionRule[]>([
    { id: '1', dataType: 'User Data', period: '30 days', days: 30, autoDelete: true, icon: <Archive className="w-4 h-4 text-cyan-400" /> },
    { id: '2', dataType: 'Application Logs', period: '7 days', days: 7, autoDelete: true, icon: <Clock className="w-4 h-4 text-violet-400" /> },
    { id: '3', dataType: 'Analytics Events', period: '90 days', days: 90, autoDelete: false, icon: <Clock className="w-4 h-4 text-amber-400" /> },
    { id: '4', dataType: 'Database Backups', period: '1 year', days: 365, autoDelete: true, icon: <Archive className="w-4 h-4 text-emerald-400" /> },
    { id: '5', dataType: 'Session Tokens', period: '24 hours', days: 1, autoDelete: true, icon: <Clock className="w-4 h-4 text-red-400" /> },
  ]);
  const [dragId, setDragId] = useState<string | null>(null);
  if (!open) return null;

  const toggleAuto = (id: string) => setRules((p) => p.map((r) => r.id === id ? { ...r, autoDelete: !r.autoDelete } : r));
  const remove = (id: string) => setRules((p) => p.filter((r) => r.id !== id));
  const autoCount = rules.filter((r) => r.autoDelete).length;
  const maxDays = Math.max(...rules.map((r) => r.days));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Archive className="w-5 h-5 text-violet-400" /><h3 className="text-sm font-semibold text-slate-100">Data Retention Policy Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{rules.length}</p><p className="text-[10px] text-slate-500">Data types</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{autoCount}</p><p className="text-[10px] text-slate-500">Auto-delete</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-violet-400">{maxDays}d</p><p className="text-[10px] text-slate-500">Max period</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center gap-3 mb-2" draggable onDragStart={() => setDragId(r.id)}>
                {r.icon}
                <p className="text-sm font-medium text-slate-200 flex-1">{r.dataType}</p>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300"><Calendar className="w-2.5 h-2.5" />{r.period}</span>
                <button onClick={() => remove(r.id)} className="text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-[10px] text-slate-600 mb-2">Retained for {r.days} day{r.days !== 1 ? 's' : ''} then {r.autoDelete ? 'auto-deleted' : 'kept indefinitely'}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500" style={{ width: `${Math.min(100, (r.days / maxDays) * 100)}%` }} />
                </div>
                <button onClick={() => toggleAuto(r.id)} className="inline-flex items-center gap-1 text-[11px] transition-all">
                  {r.autoDelete ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                  <span className={r.autoDelete ? 'text-emerald-400' : 'text-slate-500'}>Auto-delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add data type</button>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 ml-auto"><Trash2 className="w-3.5 h-3.5" />{autoCount} auto-delete rules active</span>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Save className="w-3.5 h-3.5" /> Save policy</button>
        </div>
      </div>
    </div>
  );
}
