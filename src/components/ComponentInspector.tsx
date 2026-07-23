import { useState } from 'react';
import { SlidersHorizontal, X, Copy, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { AppRegion, ScreenElement } from '@/types/builder';

interface ComponentInspectorProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

export default function ComponentInspector({ open, onClose, regions }: ComponentInspectorProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!open) return null;

  const allElements = regions.flatMap((r) => r.spec.elements.map((el, i) => ({ regionId: r.id, regionName: r.region_name, element: el, index: i, key: `${r.id}-${i}` })));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Component Inspector</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
          {allElements.map((item) => (
            <div key={item.key}>
              <button onClick={() => setExpanded(expanded === item.key ? null : item.key)} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-800/50 transition-colors">
                {expanded === item.key ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-xs font-mono text-cyan-400 uppercase">{item.element.kind}</span>
                <span className="text-xs text-slate-300 flex-1 truncate">{item.element.label ?? item.element.placeholder ?? `Item ${item.index + 1}`}</span>
                <span className="text-[10px] text-slate-600">{item.regionName}</span>
              </button>
              {expanded === item.key && (
                <div className="ml-8 mb-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1.5">
                  {Object.entries(item.element).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">{key}</span>
                      <span className="text-slate-300 font-mono max-w-[60%] truncate">{String(value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"><Copy className="w-3 h-3" /> Duplicate</button>
                    <button className="text-[10px] text-slate-400 hover:text-red-400 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{allElements.length} components across {regions.length} screens</span>
        </div>
      </div>
    </div>
  );
}
