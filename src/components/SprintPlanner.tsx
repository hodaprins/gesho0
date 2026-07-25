import { CalendarRange, X } from 'lucide-react';
import { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  points: number;
}

const BACKLOG: Feature[] = [
  { id: '1', title: 'OAuth integration', points: 8 },
  { id: '2', title: 'Dark mode toggle', points: 3 },
  { id: '3', title: 'Export to PDF', points: 5 },
  { id: '4', title: 'Bulk screen delete', points: 2 },
  { id: '5', title: 'Team comments v2', points: 5 },
  { id: '6', title: 'Keyboard shortcuts', points: 3 },
  { id: '7', title: 'Webhook triggers', points: 8 },
];

const VELOCITY = [22, 18, 26, 21, 28];
const VELOCITY_LABELS = ['S1', 'S2', 'S3', 'S4', 'S5'];

interface SprintPlannerProps {
  open: boolean;
  onClose: () => void;
}

export function SprintPlanner({ open, onClose }: SprintPlannerProps) {
  const [sprint, setSprint] = useState<string[]>([]);

  if (!open) return null;

  const toggleToSprint = (id: string) => {
    setSprint((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const sprintFeatures = BACKLOG.filter((f) => sprint.includes(f.id));
  const backlogFeatures = BACKLOG.filter((f) => !sprint.includes(f.id));
  const totalPoints = sprintFeatures.reduce((sum, f) => sum + f.points, 0);
  const maxVel = Math.max(...VELOCITY);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Sprint Planner</h2>
              <p className="text-xs text-slate-400">{totalPoints} pts committed · avg {Math.round(VELOCITY.reduce((a, b) => a + b, 0) / VELOCITY.length)} velocity</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">Velocity History</p>
            <div className="flex items-end justify-between gap-2 h-20">
              {VELOCITY.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-emerald-500/60" style={{ height: `${(v / maxVel) * 100}%` }} />
                  <span className="text-[9px] text-slate-500">{VELOCITY_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">Sprint Backlog · {totalPoints} pts</p>
            <div className="space-y-2">
              {sprintFeatures.length === 0 && <p className="rounded-lg border border-dashed border-slate-700 p-3 text-center text-xs text-slate-500">Tap a feature to add it to the sprint</p>}
              {sprintFeatures.map((f) => (
                <button key={f.id} onClick={() => toggleToSprint(f.id)} className="flex w-full items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-left hover:bg-emerald-500/15 transition-colors">
                  <span className="text-xs text-slate-100">{f.title}</span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">{f.points}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">Product Backlog</p>
            <div className="space-y-2">
              {backlogFeatures.map((f) => (
                <button key={f.id} onClick={() => toggleToSprint(f.id)} className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2 text-left hover:border-slate-700 transition-colors">
                  <span className="text-xs text-slate-300">{f.title}</span>
                  <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">{f.points}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
