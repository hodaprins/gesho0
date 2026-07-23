import { ListChecks, X, CheckSquare, Square, Trash2, Copy, Move, Tag } from 'lucide-react';
import { useState } from 'react';
import type { AppRegion } from '@/types/builder';

interface BulkActionsPanelProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

export default function BulkActionsPanel({ open, onClose, regions }: BulkActionsPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  if (!open) return null;

  const toggle = (id: string) => setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const allSelected = selected.size === regions.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(regions.map((r) => r.id)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ListChecks className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Bulk Actions</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800">
          <button onClick={toggleAll} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5">{allSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}{allSelected ? 'Deselect all' : 'Select all'}</button>
          <span className="text-xs text-slate-500">{selected.size} selected</span>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800 bg-slate-800/30">
            <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"><Copy className="w-3 h-3" /> Duplicate</button>
            <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"><Move className="w-3 h-3" /> Reorder</button>
            <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"><Tag className="w-3 h-3" /> Tag</button>
            <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"><Trash2 className="w-3 h-3" /> Delete</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
          {regions.map((r) => (
            <button key={r.id} onClick={() => toggle(r.id)} className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${selected.has(r.id) ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/20'}`}>
              {selected.has(r.id) ? <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{r.region_name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{r.region_type} · {r.status}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
