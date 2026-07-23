import { Network, X, Plus } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface NavigationGraphProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

export default function NavigationGraph({ open, onClose, regions }: NavigationGraphProps) {
  if (!open) return null;

  const nodes = regions.slice(0, 8).map((r, i) => {
    const angle = (i / Math.min(regions.length, 8)) * Math.PI * 2;
    const radius = 140;
    return { id: r.id, label: r.region_name, x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius, type: r.region_type };
  });

  const center = { x: 200, y: 200 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Navigation Graph</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <svg viewBox="0 0 400 400" className="w-full h-auto rounded-xl bg-slate-950/50 border border-slate-800">
            {nodes.map((node) => (
              <line key={`line-${node.id}`} x1={center.x} y1={center.y} x2={node.x} y2={node.y} stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 2" />
            ))}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="28" fill="#0f172a" stroke="#334155" strokeWidth="2" className="cursor-pointer hover:stroke-cyan-500 transition-colors" />
                <text x={node.x} y={node.y - 2} textAnchor="middle" className="fill-slate-300 text-[8px] font-medium" style={{ fontSize: '8px' }}>{node.label.slice(0, 10)}</text>
                <text x={node.x} y={node.y + 8} textAnchor="middle" className="fill-slate-600 text-[6px]" style={{ fontSize: '6px' }}>{node.type}</text>
              </g>
            ))}
            <circle cx={center.x} cy={center.y} r="36" fill="#14b8a6" opacity="0.15" />
            <circle cx={center.x} cy={center.y} r="28" fill="#0f172a" stroke="#14b8a6" strokeWidth="2" />
            <text x={center.x} y={center.y - 2} textAnchor="middle" className="fill-teal-400 text-[9px] font-bold" style={{ fontSize: '9px' }}>Root</text>
            <text x={center.x} y={center.y + 8} textAnchor="middle" className="fill-teal-600 text-[7px]" style={{ fontSize: '7px' }}>Navigation</text>
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-950/40 p-2 text-center">
              <p className="text-lg font-bold text-slate-100">{nodes.length}</p>
              <p className="text-[10px] text-slate-500">Screens</p>
            </div>
            <div className="rounded-lg bg-slate-950/40 p-2 text-center">
              <p className="text-lg font-bold text-slate-100">{nodes.length}</p>
              <p className="text-[10px] text-slate-500">Connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
