import { Repeat, X } from 'lucide-react';
import { useState } from 'react';

interface GrowthLoopVisualizerProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  { label: 'Acquire', color: '#6366f1', icon: '📥' },
  { label: 'Activate', color: '#06b6d4', icon: '⚡' },
  { label: 'Engage', color: '#10b981', icon: '🔥' },
  { label: 'Refer', color: '#f59e0b', icon: '🔗' },
  { label: 'Revenue', color: '#ec4899', icon: '💰' },
];

export default function GrowthLoopVisualizer({ open, onClose }: GrowthLoopVisualizerProps) {
  const [active, setActive] = useState(0);

  if (!open) return null;

  const radius = 110;
  const center = 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Repeat className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Growth Loop Visualizer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="flex justify-center">
            <svg width={300} height={300} viewBox="0 0 300 300">
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 6" />
              {STEPS.map((step, i) => {
                const angle = (i / STEPS.length) * 2 * Math.PI - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                const nextAngle = ((i + 1) / STEPS.length) * 2 * Math.PI - Math.PI / 2;
                const nx = center + radius * Math.cos(nextAngle);
                const ny = center + radius * Math.sin(nextAngle);
                const isActive = i === active;
                return (
                  <g key={step.label} onClick={() => setActive(i)} className="cursor-pointer">
                    <path d={`M ${x} ${y} A ${radius} ${radius} 0 0 1 ${nx} ${ny}`} fill="none" stroke={isActive ? step.color : '#334155'} strokeWidth="3" opacity={isActive ? 1 : 0.4} />
                    <circle cx={x} cy={y} r={isActive ? 30 : 24} fill={isActive ? step.color : '#0f172a'} stroke={step.color} strokeWidth="2" className="transition-all" />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="16">{step.icon}</text>
                    <text x={x} y={y + 48} textAnchor="middle" fontSize="11" fill={isActive ? '#f1f5f9' : '#64748b'} className="font-medium">{step.label}</text>
                  </g>
                );
              })}
              <text x={center} y={center - 5} textAnchor="middle" fontSize="10" fill="#64748b">Growth</text>
              <text x={center} y={center + 10} textAnchor="middle" fontSize="10" fill="#64748b">Loop</text>
            </svg>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STEPS[active].color }} />
              <span className="text-sm font-semibold text-slate-200">{STEPS[active].label}</span>
            </div>
            <p className="text-xs text-slate-400">
              {active === 0 && 'Drive qualified users through paid, organic, and referral channels into the top of the funnel.'}
              {active === 1 && 'Deliver the aha moment fast — onboarding and first-run experience should create immediate value.'}
              {active === 2 && 'Build habit-forming loops with notifications, streaks, and personalized content to drive retention.'}
              {active === 3 && 'Turn engaged users into advocates with shareable moments and referral incentives.'}
              {active === 4 && 'Convert engaged users to paying customers; revenue funds the next acquire cycle.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setActive((p) => (p - 1 + STEPS.length) % STEPS.length)} className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800">Prev</button>
            <span className="text-xs text-slate-500">{active + 1} / {STEPS.length}</span>
            <button onClick={() => setActive((p) => (p + 1) % STEPS.length)} className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
