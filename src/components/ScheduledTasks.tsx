import { useState } from 'react';
import { Clock, X, Plus, Trash2, Play, Pause } from 'lucide-react';

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  description: string;
  enabled: boolean;
  lastRun: string;
  nextRun: string;
}

const INITIAL: ScheduledTask[] = [
  { id: '1', name: 'Daily report email', schedule: '0 9 * * *', description: 'Send daily analytics summary', enabled: true, lastRun: '2h ago', nextRun: 'in 22h' },
  { id: '2', name: 'Database backup', schedule: '0 2 * * 0', description: 'Weekly database backup', enabled: true, lastRun: '2d ago', nextRun: 'in 5d' },
  { id: '3', name: 'Cleanup expired sessions', schedule: '*/15 * * * *', description: 'Remove expired user sessions', enabled: true, lastRun: '5m ago', nextRun: 'in 10m' },
  { id: '4', name: 'Monthly analytics', schedule: '0 0 1 * *', description: 'Generate monthly report', enabled: false, lastRun: '23d ago', nextRun: 'in 8d' },
];

interface ScheduledTasksProps {
  open: boolean;
  onClose: () => void;
}

export default function ScheduledTasks({ open, onClose }: ScheduledTasksProps) {
  const [tasks, setTasks] = useState<ScheduledTask[]>(INITIAL);
  if (!open) return null;

  const toggle = (id: string) => setTasks((p) => p.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));
  const remove = (id: string) => setTasks((p) => p.filter((t) => t.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Scheduled Tasks</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(task.id)} className={`w-7 h-3.5 rounded-full transition-colors relative ${task.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${task.enabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </button>
                  <p className="text-sm font-medium text-slate-200">{task.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {task.enabled ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-slate-600" />}
                  <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1">{task.description}</p>
              <div className="flex items-center gap-3 text-[10px]">
                <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">{task.schedule}</code>
                <span className="text-slate-600">Last: {task.lastRun}</span>
                <span className="text-slate-600">Next: {task.nextRun}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setTasks((p) => [...p, { id: crypto.randomUUID(), name: 'New Task', schedule: '0 * * * *', description: 'Task description', enabled: true, lastRun: 'Never', nextRun: 'in 1h' }])}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add task
          </button>
          <span className="text-xs text-slate-500">{tasks.filter(t => t.enabled).length} active</span>
        </div>
      </div>
    </div>
  );
}
