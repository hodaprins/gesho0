import { useMemo } from 'react';
import { Workflow, ArrowRight } from 'lucide-react';
import type { AppRegion, NavNode, NavEdge } from '@/types/builder';

interface ScreenFlowProps {
  regions: AppRegion[];
  onScreenClick?: (region: AppRegion) => void;
}

export default function ScreenFlow({ regions, onScreenClick }: ScreenFlowProps) {
  const { nodes, edges } = useMemo(() => buildGraph(regions), [regions]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
        <Workflow className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Navigation Flow</h3>
        <span className="text-xs text-slate-500 ml-auto">{nodes.length} screens</span>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin p-6 bg-slate-950/30 relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '400px' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#475569" />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            const x1 = from.x + 110;
            const y1 = from.y + 35;
            const x2 = to.x;
            const y2 = to.y + 35;
            const midX = (x1 + x2) / 2;
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={midX}
                  y={(y1 + y2) / 2 - 4}
                  fill="#64748b"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="relative" style={{ minHeight: '400px' }}>
          {nodes.map((node) => {
            const region = regions.find((r) => r.id === node.id);
            const isComplete = region?.status === 'complete';
            return (
              <button
                key={node.id}
                onClick={() => region && onScreenClick?.(region)}
                className="absolute rounded-xl border p-3 text-left transition-all hover:scale-105 hover:z-10 animate-fade-in-up"
                style={{
                  left: node.x,
                  top: node.y,
                  width: '110px',
                  borderColor: isComplete ? '#10b98140' : '#f59e0b40',
                  backgroundColor: isComplete ? '#10b98110' : '#f59e0b10',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 text-[10px] font-bold text-white"
                  style={{
                    backgroundColor: node.type === 'auth' ? '#6366f1' : node.type === 'settings' ? '#475569' : '#0ea5e9',
                  }}
                >
                  {node.label.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs font-semibold text-slate-200 truncate">{node.label}</p>
                <p className="text-[9px] text-slate-500 capitalize">{node.type}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isComplete ? '#10b981' : '#f59e0b' }}
                  />
                  <span className="text-[8px] text-slate-500">{isComplete ? 'Ready' : 'Pending'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function buildGraph(regions: AppRegion[]): { nodes: NavNode[]; edges: NavEdge[] } {
  const nodes: NavNode[] = [];
  const edges: NavEdge[] = [];
  const cols = 3;
  const nodeW = 140;
  const nodeH = 80;
  const gapX = 60;
  const gapY = 40;

  regions.forEach((region, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    nodes.push({
      id: region.id,
      label: region.region_name,
      screenName: region.region_name,
      x: col * (nodeW + gapX) + 20,
      y: row * (nodeH + gapY) + 20,
      type: region.region_type as NavNode['type'],
    });
  });

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ from: nodes[i].id, to: nodes[i + 1].id, label: 'navigates' });
  }
  const authNode = nodes.find((n) => n.type === 'auth');
  const homeNode = nodes.find((n) => n.type === 'screen');
  if (authNode && homeNode && authNode.id !== homeNode.id) {
    edges.push({ from: authNode.id, to: homeNode.id, label: 'login' });
  }
  const settingsNode = nodes.find((n) => n.type === 'settings');
  const lastScreen = nodes.filter((n) => n.type === 'screen').pop();
  if (settingsNode && lastScreen && settingsNode.id !== lastScreen.id) {
    edges.push({ from: lastScreen.id, to: settingsNode.id, label: 'settings' });
  }

  return { nodes, edges };
}
