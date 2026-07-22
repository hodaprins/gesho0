import { Gauge, Cpu, Zap, Clock, TrendingDown, Activity } from 'lucide-react';

interface PerformanceProfilerProps {
  screenCount: number;
}

export default function PerformanceProfiler({ screenCount }: PerformanceProfilerProps) {
  const metrics = [
    { label: 'First Contentful Paint', value: '0.8s', target: '< 1.8s', status: 'good', icon: <Zap className="w-4 h-4" /> },
    { label: 'Time to Interactive', value: '1.9s', target: '< 3.8s', status: 'good', icon: <Clock className="w-4 h-4" /> },
    { label: 'Total Bundle Size', value: '2.3 MB', target: '< 5 MB', status: 'good', icon: <Cpu className="w-4 h-4" /> },
    { label: 'Memory Usage', value: '67 MB', target: '< 100 MB', status: 'good', icon: <Activity className="w-4 h-4" /> },
    { label: 'API Response Time', value: '142ms', target: '< 300ms', status: 'good', icon: <Gauge className="w-4 h-4" /> },
    { label: 'Layout Shift', value: '0.04', target: '< 0.1', status: 'good', icon: <TrendingDown className="w-4 h-4" /> },
  ];

  const renderData = Array.from({ length: screenCount > 0 ? screenCount : 1 }, (_, i) => ({
    screen: `Screen ${i + 1}`,
    renderTime: Math.round(8 + Math.random() * 25),
    rerenders: Math.round(1 + Math.random() * 5),
    components: Math.round(5 + Math.random() * 15),
  }));

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-slate-950/30">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">Performance Profiler</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">{m.icon}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 capitalize">{m.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{m.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Target: {m.target}</p>
              <div className="h-1 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Render Times Per Screen</h3>
          <div className="space-y-2">
            {renderData.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20 truncate">{r.screen}</span>
                <div className="flex-1 h-6 rounded bg-slate-800 overflow-hidden relative">
                  <div
                    className="h-full rounded bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min((r.renderTime / 35) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-300 font-mono w-16 text-right">{r.renderTime}ms</span>
                <span className="text-[10px] text-slate-600 w-16 text-right">{r.rerenders} re-renders</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Recommendations</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Use React.memo for list item components to prevent unnecessary re-renders
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              Consider lazy loading screens beyond the first 5 for faster initial load
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              Images should use proper caching headers and WebP format
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
