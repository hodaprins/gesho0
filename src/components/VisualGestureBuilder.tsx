import { Hand, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GestureDef {
  id: string;
  type: 'tap' | 'double_tap' | 'long_press' | 'swipe_left' | 'swipe_right' | 'swipe_up' | 'swipe_down' | 'pinch' | 'rotate' | 'pan';
  target: string;
  action: string;
  minFingers: number;
}

const INITIAL: GestureDef[] = [
  { id: '1', type: 'tap', target: 'Card', action: 'Open detail', minFingers: 1 },
  { id: '2', type: 'double_tap', target: 'Image', action: 'Like', minFingers: 1 },
  { id: '3', type: 'long_press', target: 'List Item', action: 'Show context menu', minFingers: 1 },
  { id: '4', type: 'swipe_left', target: 'List Item', action: 'Delete', minFingers: 1 },
  { id: '5', type: 'swipe_right', target: 'List Item', action: 'Archive', minFingers: 1 },
  { id: '6', type: 'pinch', target: 'Image', action: 'Zoom', minFingers: 2 },
  { id: '7', type: 'swipe_down', target: 'Screen', action: 'Refresh', minFingers: 1 },
];

const GESTURE_ICONS: Record<string, React.ReactNode> = {
  tap: '👆', double_tap: '👆👆', long_press: '⏱️', swipe_left: '👈', swipe_right: '👉', swipe_up: '👆', swipe_down: '👇', pinch: '🤏', rotate: '🔄', pan: '✋',
};

interface VisualGestureBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function VisualGestureBuilder({ open, onClose }: VisualGestureBuilderProps) {
  const [gestures, setGestures] = useState<GestureDef[]>(INITIAL);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Hand className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Gesture Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {gestures.map((g) => (
            <div key={g.id} className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-2xl">{GESTURE_ICONS[g.type]}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200 capitalize">{g.type.replace('_', ' ')}</p>
                <p className="text-xs text-slate-500">on <span className="text-cyan-400">{g.target}</span> → <span className="text-emerald-400">{g.action}</span></p>
              </div>
              <span className="text-[10px] text-slate-600">{g.minFingers} finger{g.minFingers > 1 ? 's' : ''}</span>
              <button onClick={() => setGestures((p) => p.filter((x) => x.id !== g.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setGestures((p) => [...p, { id: crypto.randomUUID(), type: 'tap', target: 'Element', action: 'Custom action', minFingers: 1 }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add gesture</button>
          <span className="text-xs text-slate-500">{gestures.length} gestures defined</span>
        </div>
      </div>
    </div>
  );
}
