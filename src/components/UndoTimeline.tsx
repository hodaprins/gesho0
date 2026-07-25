import { useState } from 'react';
import { History, X, RotateCcw, Undo2, Clock, Trash2 } from 'lucide-react';

interface UndoTimelineProps {
  open: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  icon: string;
}

const ENTRIES: HistoryEntry[] = [
  { id: '1', action: 'Added login screen', detail: 'Email + password fields, forgot password link', timestamp: '2 min ago', icon: 'add' },
  { id: '2', action: 'Changed primary color', detail: '#3B82F6 → #06B6D4 (cyan)', timestamp: '8 min ago', icon: 'color' },
  { id: '3', action: 'Added navigation bar', detail: 'Bottom tab bar with 4 items', timestamp: '15 min ago', icon: 'add' },
  { id: '4', action: 'Removed hero image', detail: 'Deleted image from Home screen', timestamp: '22 min ago', icon: 'delete' },
  { id: '5', action: 'Moved profile card', detail: 'Reordered to top of settings screen', timestamp: '35 min ago', icon: 'move' },
  { id: '6', action: 'Updated app name', detail: '"My App" → "TaskFlow"', timestamp: '1 hr ago', icon: 'edit' },
  { id: '7', action: 'Added settings screen', detail: 'Theme toggle, notifications, account', timestamp: '2 hr ago', icon: 'add' },
];

export default function UndoTimeline({ open, onClose }: UndoTimelineProps) {
  const [selected, setSelected] = useState<string | null>(ENTRIES[0].id);

  if (!open) return null;

  const selectedEntry = ENTRIES.find((e) => e.id === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-100">Undo History</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-800" />
            <div className="space-y-1">
              {ENTRIES.map((e, i) => {
                const isSel = selected === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-colors text-left ${isSel ? 'bg-slate-800' : 'hover:bg-slate-800/40'}`}
                  >
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSel ? 'bg-violet-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                      {isSel ? <RotateCcw className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-medium truncate ${isSel ? 'text-slate-100' : 'text-slate-300'}`}>{e.action}</p>
                        <span className="text-[10px] text-slate-500 shrink-0">{e.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{e.detail}</p>
                      {i === 0 && <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400">Current</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            {selectedEntry && `Restore to "${selectedEntry.action}"?`}
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium">
              <Undo2 className="w-3.5 h-3.5" /> Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
