import { Pin, X } from 'lucide-react';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  desc: string;
}

const ALL_TOOLS: Tool[] = [
  { id: '1', name: 'Screen Recorder', desc: 'Capture flows' },
  { id: '2', name: 'Color Picker', desc: 'Sample palettes' },
  { id: '3', name: 'Asset Exporter', desc: 'Batch export' },
  { id: '4', name: 'Grid Overlay', desc: 'Alignment guides' },
  { id: '5', name: 'Inspector', desc: 'Debug layers' },
  { id: '6', name: 'Hotspot Mapper', desc: 'Link screens' },
  { id: '7', name: 'Text Styles', desc: 'Type system' },
  { id: '8', name: 'Token Sync', desc: 'Design tokens' },
];

interface PinnedFavoritesBarProps {
  open: boolean;
  onClose: () => void;
}

export function PinnedFavoritesBar({ open, onClose }: PinnedFavoritesBarProps) {
  const [pinned, setPinned] = useState<string[]>(['1', '4', '7']);
  const [dragId, setDragId] = useState<string | null>(null);

  if (!open) return null;

  const togglePin = (id: string) => {
    setPinned((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const reorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setPinned((prev) => {
      const arr = [...prev];
      const from = arr.indexOf(dragId);
      const to = arr.indexOf(targetId);
      arr.splice(from, 1);
      arr.splice(to, 0, dragId);
      return arr;
    });
    setDragId(null);
  };

  const pinnedTools = pinned.map((id) => ALL_TOOLS.find((t) => t.id === id)!).filter(Boolean);
  const availableTools = ALL_TOOLS.filter((t) => !pinned.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
              <Pin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Pinned Favorites</h2>
              <p className="text-xs text-slate-400">Drag to reorder · click pin to toggle</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-teal-400">Pinned · {pinnedTools.length}</p>
            <div className="space-y-2">
              {pinnedTools.length === 0 && <p className="rounded-lg border border-dashed border-slate-700 p-3 text-center text-xs text-slate-500">No pinned tools yet</p>}
              {pinnedTools.map((tool) => (
                <div
                  key={tool.id}
                  draggable
                  onDragStart={() => setDragId(tool.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorder(tool.id)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${dragId === tool.id ? 'border-teal-500/50 bg-teal-500/5' : 'border-slate-800 bg-slate-800/40'}`}
                >
                  <span className="cursor-grab text-slate-600 select-none">⋮⋮</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-100">{tool.name}</p>
                    <p className="text-[10px] text-slate-500">{tool.desc}</p>
                  </div>
                  <button onClick={() => togglePin(tool.id)} className="text-teal-400 hover:text-teal-300 transition-colors" aria-label={`Unpin ${tool.name}`}>
                    <Pin className="h-4 w-4 fill-teal-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">Available · {availableTools.length}</p>
            <div className="space-y-2">
              {availableTools.map((tool) => (
                <div key={tool.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-300">{tool.name}</p>
                    <p className="text-[10px] text-slate-500">{tool.desc}</p>
                  </div>
                  <button onClick={() => togglePin(tool.id)} className="text-slate-500 hover:text-teal-400 transition-colors" aria-label={`Pin ${tool.name}`}>
                    <Pin className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
