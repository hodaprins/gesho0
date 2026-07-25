import { useState } from 'react';
import { Map, X, Layers, Monitor } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface MiniMapNavigatorProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

const STATUS_COLOR: Record<string, string> = {
  complete: 'border-emerald-500/40 bg-emerald-500/10',
  incomplete: 'border-slate-700 bg-slate-800/50',
  building: 'border-amber-500/40 bg-amber-500/10',
};

const TYPE_ICON: Record<string, string> = {
  screen: '🏠', auth: '🔐', navigation: '🧭', data: '📊', settings: '⚙️', component: '🧩',
};

export default function MiniMapNavigator({ open, onClose, regions }: MiniMapNavigatorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  const current = regions.find((r) => r.id === selected) ?? regions[0];
  const gridCols = Math.min(regions.length, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Mini-Map Navigator</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-400">{regions.length} screens · click to navigate</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
              {regions.map((r) => {
                const isSel = current?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`relative rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.03] ${isSel ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-slate-800'} ${STATUS_COLOR[r.status] ?? 'border-slate-700 bg-slate-800/50'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{TYPE_ICON[r.region_type] ?? '📱'}</span>
                      {isSel && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                    </div>
                    <div className="space-y-1 mb-2">
                      <div className="h-1.5 w-full rounded bg-slate-700/60" />
                      <div className="h-1.5 w-2/3 rounded bg-slate-700/60" />
                      <div className="h-1.5 w-1/2 rounded bg-slate-700/60" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-300 truncate">{r.region_name}</p>
                    <span className="text-[9px] text-slate-500 capitalize">{r.region_type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-56 border-l border-slate-800 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-slate-300">Screen Details</span>
            </div>
            {current && (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 mb-0.5">Name</p>
                  <p className="text-slate-200 font-medium">{current.region_name}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Type</p>
                  <p className="text-slate-300 capitalize">{current.region_type}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Status</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${current.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' : current.status === 'building' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{current.status}</span>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Order</p>
                  <p className="text-slate-300 font-mono">#{current.sort_order}</p>
                </div>
                <button className="w-full mt-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 py-2 text-xs font-medium transition-colors">
                  Navigate →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
