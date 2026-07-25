import { useState } from 'react';
import { LayoutGrid, X, GripVertical, Eye, EyeOff, BarChart3, Activity, Zap, Users, Check } from 'lucide-react';

interface CustomizableDashboardProps {
  open: boolean;
  onClose: () => void;
}

interface Widget {
  id: string;
  name: string;
  desc: string;
  icon: typeof BarChart3;
  enabled: boolean;
}

const INITIAL_WIDGETS: Widget[] = [
  { id: 'analytics', name: 'Analytics', desc: 'Usage charts and metrics', icon: BarChart3, enabled: true },
  { id: 'activity', name: 'Recent Activity', desc: 'Latest build and edit events', icon: Activity, enabled: true },
  { id: 'quick', name: 'Quick Actions', desc: 'Shortcuts to common tasks', icon: Zap, enabled: true },
  { id: 'team', name: 'Team Status', desc: 'Collaborator presence and roles', icon: Users, enabled: false },
];

export default function CustomizableDashboard({ open, onClose }: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  if (!open) return null;

  const toggle = (id: string) => setWidgets((p) => p.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)));
  const move = (from: number, to: number) => {
    setWidgets((p) => {
      const arr = [...p];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">Customize Dashboard</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3">
          <p className="text-xs text-slate-500 mb-1">Drag to reorder · toggle to show or hide widgets</p>
          {widgets.map((w, i) => {
            const Icon = w.icon;
            return (
              <div
                key={w.id}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragIdx !== null && dragIdx !== i) move(dragIdx, i); setDragIdx(null); }}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${dragIdx === i ? 'opacity-40 border-indigo-500/50' : 'border-slate-800 bg-slate-950/40'} ${!w.enabled ? 'opacity-60' : ''}`}
              >
                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab active:cursor-grabbing shrink-0" />
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${w.enabled ? 'bg-indigo-500/15 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200">{w.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{w.desc}</p>
                </div>
                <button
                  onClick={() => toggle(w.id)}
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${w.enabled ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-slate-600 hover:bg-slate-800'}`}
                >
                  {w.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">{widgets.filter((w) => w.enabled).length} of {widgets.length} active</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-medium"
          >
            <Check className="w-3.5 h-3.5" /> Save layout
          </button>
        </div>
      </div>
    </div>
  );
}
