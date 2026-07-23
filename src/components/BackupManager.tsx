import { useState } from 'react';
import { HardDriveDownload, X, Check, Clock, RotateCcw, Trash2 } from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'complete' | 'in_progress' | 'failed';
}

const INITIAL: Backup[] = [
  { id: '1', name: 'backup-20260723-0200', date: '2026-07-23 02:00', size: '45.2 MB', type: 'auto', status: 'complete' },
  { id: '2', name: 'backup-20260722-0200', date: '2026-07-22 02:00', size: '44.8 MB', type: 'auto', status: 'complete' },
  { id: '3', name: 'backup-20260721-0200', date: '2026-07-21 02:00', size: '44.1 MB', type: 'auto', status: 'complete' },
  { id: '4', name: 'manual-pre-deploy', date: '2026-07-20 15:30', size: '43.5 MB', type: 'manual', status: 'complete' },
  { id: '5', name: 'backup-20260720-0200', date: '2026-07-20 02:00', size: '43.0 MB', type: 'auto', status: 'complete' },
];

interface BackupManagerProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_ICON: Record<string, React.ReactNode> = { complete: <Check className="w-3 h-3 text-emerald-400" />, in_progress: <Clock className="w-3 h-3 text-cyan-400 animate-spin" />, failed: <X className="w-3 h-3 text-red-400" /> };

export default function BackupManager({ open, onClose }: BackupManagerProps) {
  const [backups, setBackups] = useState<Backup[]>(INITIAL);
  const [creating, setCreating] = useState(false);
  if (!open) return null;

  const createBackup = () => {
    setCreating(true);
    setTimeout(() => {
      setBackups((p) => [{ id: crypto.randomUUID(), name: `manual-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')}`, date: new Date().toISOString().slice(0, 16).replace('T', ' '), size: '45.5 MB', type: 'manual' as const, status: 'complete' as const }, ...p]);
      setCreating(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><HardDriveDownload className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Backups</h3><span className="text-xs text-slate-500">{backups.length} backups</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          <div className="rounded-lg bg-slate-800/40 p-3 flex items-center justify-between mb-2">
            <div><p className="text-xs text-slate-400">Auto-backup schedule</p><p className="text-sm text-slate-200">Daily at 02:00 UTC</p></div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
          </div>
          {backups.map((b) => (
            <div key={b.id} className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              {STATUS_ICON[b.status]}
              <div className="flex-1">
                <p className="text-sm font-mono text-slate-200">{b.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{b.date}</span><span>·</span><span>{b.size}</span>
                  <span className={`px-1.5 py-0.5 rounded ${b.type === 'auto' ? 'bg-slate-800 text-slate-400' : 'bg-cyan-500/20 text-cyan-400'}`}>{b.type}</span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"><RotateCcw className="w-3.5 h-3.5" /></button>
              <button onClick={() => setBackups((p) => p.filter((x) => x.id !== b.id))} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={createBackup} disabled={creating} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40">
            {creating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <HardDriveDownload className="w-3.5 h-3.5" />}
            {creating ? 'Creating...' : 'Create backup'}
          </button>
          <span className="text-xs text-slate-500">Retention: 30 days</span>
        </div>
      </div>
    </div>
  );
}
