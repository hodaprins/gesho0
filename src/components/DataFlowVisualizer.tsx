import { useState } from 'react';
import { GitFork, X, Database, Server, Cloud, Users, ArrowRight } from 'lucide-react';

interface FlowNode {
  id: string;
  label: string;
  layer: 'source' | 'processing' | 'storage' | 'third_party';
  icon: React.ReactNode;
  x: number;
  y: number;
}

interface FlowEdge {
  from: string;
  to: string;
  label: string;
}

const NODES: FlowNode[] = [
  { id: 's1', label: 'User Input', layer: 'source', icon: <Users className="w-4 h-4 text-cyan-400" />, x: 40, y: 40 },
  { id: 's2', label: 'OAuth', layer: 'source', icon: <Users className="w-4 h-4 text-cyan-400" />, x: 40, y: 140 },
  { id: 'p1', label: 'API Gateway', layer: 'processing', icon: <Server className="w-4 h-4 text-violet-400" />, x: 220, y: 40 },
  { id: 'p2', label: 'Worker Queue', layer: 'processing', icon: <Server className="w-4 h-4 text-violet-400" />, x: 220, y: 140 },
  { id: 'd1', label: 'Postgres', layer: 'storage', icon: <Database className="w-4 h-4 text-emerald-400" />, x: 400, y: 40 },
  { id: 'd2', label: 'S3 Bucket', layer: 'storage', icon: <Database className="w-4 h-4 text-emerald-400" />, x: 400, y: 140 },
  { id: 't1', label: 'Stripe', layer: 'third_party', icon: <Cloud className="w-4 h-4 text-amber-400" />, x: 580, y: 40 },
  { id: 't2', label: 'SendGrid', layer: 'third_party', icon: <Cloud className="w-4 h-4 text-amber-400" />, x: 580, y: 140 },
];

const EDGES: FlowEdge[] = [
  { from: 's1', to: 'p1', label: 'JSON' },
  { from: 's2', to: 'p1', label: 'Token' },
  { from: 'p1', to: 'd1', label: 'SQL' },
  { from: 'p1', to: 'p2', label: 'Queue' },
  { from: 'p2', to: 'd2', label: 'Files' },
  { from: 'd1', to: 't1', label: 'Charges' },
  { from: 'p2', to: 't2', label: 'Emails' },
];

const LAYER_COLOR: Record<string, string> = { source: 'border-cyan-500/30', processing: 'border-violet-500/30', storage: 'border-emerald-500/30', third_party: 'border-amber-500/30' };

interface DataFlowVisualizerProps {
  open: boolean;
  onClose: () => void;
}

export default function DataFlowVisualizer({ open, onClose }: DataFlowVisualizerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  if (!open) return null;
  const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><GitFork className="w-5 h-5 text-violet-400" /><h3 className="text-sm font-semibold text-slate-100">Data Flow Visualizer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-3 px-5 py-2 border-b border-slate-800 flex-wrap">
          {Object.entries(LAYER_COLOR).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded border ${color}`} /><span className="text-[10px] text-slate-400 capitalize">{key.replace('_', ' ')}</span></div>
          ))}
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin p-2">
          <svg viewBox="0 0 700 210" className="w-full h-auto min-w-[600px]">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#475569" /></marker>
            </defs>
            {EDGES.map((e, i) => {
              const from = nodeById(e.from); const to = nodeById(e.to);
              const mx = (from.x + to.x) / 2;
              return (
                <g key={i}>
                  <path d={`M${from.x + 70},${from.y + 16} C${mx},${from.y + 16} ${mx},${to.y + 16} ${to.x},${to.y + 16}`} fill="none" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x={mx} y={(from.y + to.y) / 2 + 12} textAnchor="middle" className="fill-slate-600 text-[8px]">{e.label}</text>
                </g>
              );
            })}
            {NODES.map((n) => (
              <g key={n.id} onClick={() => setSelected(n.id)} className="cursor-pointer">
                <rect x={n.x} y={n.y} width="70" height="32" rx="6" className={`${selected === n.id ? 'fill-slate-700 stroke-slate-400' : 'fill-slate-800 stroke-slate-700'}`} strokeWidth="1" />
                <text x={n.x + 35} y={n.y + 20} textAnchor="middle" className="fill-slate-300 text-[8px] font-medium">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="px-5 py-3 border-t border-slate-800">
          {selected ? (
            <div className="flex items-center gap-2 text-xs">
              {nodeById(selected).icon}
              <span className="text-slate-200 font-medium">{nodeById(selected).label}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 capitalize">{nodeById(selected).layer.replace('_', ' ')}</span>
              <div className="ml-auto flex items-center gap-1 text-slate-500">
                {EDGES.filter((e) => e.from === selected).map((e) => (<span key={e.to} className="inline-flex items-center gap-1 text-[10px] text-slate-400"><ArrowRight className="w-3 h-3" />{nodeById(e.to).label}</span>))}
              </div>
            </div>
          ) : <p className="text-xs text-slate-500">Select a node to inspect its data connections.</p>}
        </div>
      </div>
    </div>
  );
}
