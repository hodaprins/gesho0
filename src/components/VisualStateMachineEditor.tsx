import { Workflow, X, Plus, ArrowRight, Circle, Square } from 'lucide-react';
import { useState } from 'react';

interface StateNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface StateTransition {
  from: string;
  to: string;
  label: string;
}

const NODES: StateNode[] = [
  { id: 'idle', label: 'Idle', x: 60, y: 60, color: '#64748b' },
  { id: 'loading', label: 'Loading', x: 200, y: 30, color: '#3b82f6' },
  { id: 'success', label: 'Success', x: 340, y: 60, color: '#10b981' },
  { id: 'error', label: 'Error', x: 200, y: 150, color: '#ef4444' },
  { id: 'retry', label: 'Retry', x: 60, y: 150, color: '#f59e0b' },
];

const TRANSITIONS: StateTransition[] = [
  { from: 'idle', to: 'loading', label: 'submit()' },
  { from: 'loading', to: 'success', label: '200 OK' },
  { from: 'loading', to: 'error', label: '500 ERR' },
  { from: 'error', to: 'retry', label: 'tap retry' },
  { from: 'retry', to: 'loading', label: 'submit()' },
  { from: 'success', to: 'idle', label: 'reset()' },
];

interface VisualStateMachineEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function VisualStateMachineEditor({ open, onClose }: VisualStateMachineEditorProps) {
  const [selected, setSelected] = useState<string | null>('idle');
  if (!open) return null;

  const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Workflow className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">State Machine Editor</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <svg viewBox="0 0 400 220" className="w-full rounded-xl bg-slate-950/50 border border-slate-800">
            <defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#475569" /></marker></defs>
            {TRANSITIONS.map((t, i) => {
              const from = nodeById(t.from), to = nodeById(t.to);
              const midX = (from.x + to.x) / 2, midY = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line x1={from.x + 30} y1={from.y + 15} x2={to.x + 10} y2={to.y + 15} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowhead)" strokeDasharray="3 2" />
                  <text x={midX} y={midY - 4} textAnchor="middle" className="fill-slate-500" style={{ fontSize: '7px' }}>{t.label}</text>
                </g>
              );
            })}
            {NODES.map((n) => (
              <g key={n.id} onClick={() => setSelected(n.id)} className="cursor-pointer">
                <rect x={n.x} y={n.y} width="70" height="30" rx="8" fill={selected === n.id ? n.color : '#0f172a'} stroke={n.color} strokeWidth="2" opacity={selected === n.id ? 0.3 : 1} />
                <text x={n.x + 35} y={n.y + 18} textAnchor="middle" className="fill-slate-300 font-medium" style={{ fontSize: '10px' }}>{n.label}</text>
              </g>
            ))}
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">States ({NODES.length})</h4>
              <div className="space-y-1">
                {NODES.map((n) => <button key={n.id} onClick={() => setSelected(n.id)} className={`w-full flex items-center gap-2 text-xs px-2 py-1 rounded ${selected === n.id ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}><Circle className="w-2 h-2" style={{ color: n.color }} />{n.label}</button>)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Transitions ({TRANSITIONS.length})</h4>
              <div className="space-y-1">
                {TRANSITIONS.map((t, i) => <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1"><span className="text-slate-300">{t.from}</span><ArrowRight className="w-2.5 h-2.5" /><span className="text-cyan-400 font-mono">{t.label}</span><ArrowRight className="w-2.5 h-2.5" /><span className="text-slate-300">{t.to}</span></div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add state</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><ArrowRight className="w-3.5 h-3.5" /> Add transition</button>
        </div>
      </div>
    </div>
  );
}
