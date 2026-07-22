import { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Smartphone, Apple, Globe } from 'lucide-react';
import { generateAnalytics } from '@/lib/analytics';

interface AnalyticsDashboardProps {
  screenCount: number;
  appName: string;
}

export default function AnalyticsDashboard({ screenCount, appName }: AnalyticsDashboardProps) {
  const data = useMemo(() => generateAnalytics(screenCount), [screenCount]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-slate-950/30">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">Analytics</h2>
          <span className="text-xs text-slate-500 ml-auto">Simulated data for {appName}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3 animate-fade-in-up">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{m.value}</p>
              <div className={`flex items-center gap-0.5 text-[10px] mt-0.5 ${m.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(m.trend)}%
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Daily Active Users" series={data.users} />
          <ChartCard title="Sessions" series={data.sessions} />
          <ChartCard title="Retention %" series={data.retention} />
          <ChartCard title="Crashes" series={data.crashes} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Top Screens</h3>
            <div className="space-y-2">
              {data.topScreens.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-16 truncate">Screen {i + 1}</span>
                  <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-700"
                      style={{ width: `${(s.value / data.topScreens[0].value) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono w-12 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Device Breakdown</h3>
            <div className="flex items-center gap-4">
              <DonutChart data={data.deviceBreakdown} />
              <div className="space-y-2 flex-1">
                {data.deviceBreakdown.map((d) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-slate-300 flex-1">{d.label}</span>
                    <span className="text-xs text-slate-400 font-mono">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, series }: { title: string; series: { name: string; color: string; data: { label: string; value: number }[] } }) {
  const max = Math.max(...series.data.map((d) => d.value));
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">{title}</h3>
      <div className="flex items-end gap-1.5 h-32">
        {series.data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div
              className="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: series.color,
                minHeight: '4px',
              }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] text-white font-mono block text-center pt-0.5 transition-opacity">
                {d.value}
              </span>
            </div>
            <span className="text-[8px] text-slate-600">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {data.map((d, i) => {
          const dash = (d.value / total) * 251.2;
          const el = (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${dash} 251.2`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
    </div>
  );
}
