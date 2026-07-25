import { BarChart3, X } from 'lucide-react';

interface FeatureUsage {
  name: string;
  count: number;
}

const USAGE: FeatureUsage[] = [
  { name: 'Canvas', count: 8420 },
  { name: 'Export', count: 6180 },
  { name: 'Preview', count: 5340 },
  { name: 'Comments', count: 4120 },
  { name: 'Assets', count: 3680 },
  { name: 'Templates', count: 2410 },
];

const STATS = [
  { label: 'Time Spent', value: '42h', sub: 'this week' },
  { label: 'Actions / Day', value: '286', sub: 'avg' },
];

const PRODUCTIVITY = 78;

interface PlatformAnalyticsProps {
  open: boolean;
  onClose: () => void;
}

export function PlatformAnalytics({ open, onClose }: PlatformAnalyticsProps) {
  if (!open) return null;

  const maxCount = Math.max(...USAGE.map((u) => u.count));
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (PRODUCTIVITY / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Platform Analytics</h2>
              <p className="text-xs text-slate-400">Last 30 days usage overview</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-100">{stat.value}</p>
                <p className="text-[10px] text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-wide text-slate-500">Most Used Features</p>
            <svg viewBox="0 0 420 160" className="w-full" preserveAspectRatio="none">
              {USAGE.map((u, i) => {
                const barHeight = (u.count / maxCount) * 120;
                const x = i * 68 + 10;
                const y = 140 - barHeight;
                return (
                  <g key={u.name}>
                    <rect x={x} y={y} width="48" height={barHeight} rx="4" className="fill-blue-500/60" />
                    <text x={x + 24} y={155} textAnchor="middle" className="fill-slate-500 text-[8px]">
                      {u.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
                <circle cx="40" cy="40" r="36" strokeWidth="7" className="fill-none stroke-slate-700" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="fill-none stroke-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-100">{PRODUCTIVITY}</span>
                <span className="text-[8px] text-slate-500">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Productivity Score</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Your workflow efficiency is above the team average of 64. Keep up the consistent activity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
