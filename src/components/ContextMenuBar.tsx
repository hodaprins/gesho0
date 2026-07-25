import { useState } from 'react';
import { MousePointerClick, X, Copy, ClipboardPaste, CopyPlus, Trash2, Lock, Scissors, CornerUpLeft } from 'lucide-react';

interface ContextMenuBarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  shortcut: string;
  icon: typeof Copy;
  danger?: boolean;
  dividerAfter?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'undo', label: 'Undo', shortcut: '⌘Z', icon: CornerUpLeft },
  { id: 'copy', label: 'Copy', shortcut: '⌘C', icon: Copy },
  { id: 'paste', label: 'Paste', shortcut: '⌘V', icon: ClipboardPaste, dividerAfter: true },
  { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D', icon: CopyPlus },
  { id: 'cut', label: 'Cut', shortcut: '⌘X', icon: Scissors, dividerAfter: true },
  { id: 'lock', label: 'Lock', shortcut: '⌘L', icon: Lock },
  { id: 'delete', label: 'Delete', shortcut: '⌫', icon: Trash2, danger: true },
];

export default function ContextMenuBar({ open, onClose }: ContextMenuBarProps) {
  const [clicked, setClicked] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 200, y: 160 });

  if (!open) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setClicked(id);
  };

  const openMenuAt = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-semibold text-slate-100">Context Menu</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 p-5 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500">Right-click (or click) the area below to open the context menu</p>
          <div
            onClick={openMenuAt}
            className="relative w-full h-56 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/40 flex items-center justify-center cursor-crosshair select-none"
          >
            <span className="text-xs text-slate-600 pointer-events-none">Click anywhere here</span>
            {clicked && (
              <div
                className="absolute z-10 w-52 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl py-1.5 animate-fade-in-up"
                style={{ left: Math.min(pos.x, 180), top: Math.min(pos.y, 130) }}
                onClick={(e) => e.stopPropagation()}
              >
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id}>
                      <button
                        onClick={(e) => handleClick(e, item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors ${item.danger ? 'text-rose-400 hover:bg-rose-500/10' : clicked === item.id ? 'text-slate-100 bg-slate-700/50' : 'text-slate-300 hover:bg-slate-700/50'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.shortcut}</span>
                      </button>
                      {item.dividerAfter && <div className="my-1 h-px bg-slate-700" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {clicked && (
            <div className="w-full rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs text-slate-400">
                Selected: <span className="text-slate-200 font-medium capitalize">{clicked}</span>
              </span>
              <button onClick={() => setClicked(null)} className="ml-auto text-[10px] text-slate-500 hover:text-slate-300">Clear</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
