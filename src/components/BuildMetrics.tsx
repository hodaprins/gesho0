import { BarChart3, Cpu, Database, FileCode, Zap, Clock } from 'lucide-react';
import type { AppRegion, BuildMetric } from '@/types/builder';

interface BuildMetricsProps {
  regions: AppRegion[];
  stages: { status: string; stage_name: string }[];
}

export default function BuildMetrics({ regions, stages }: BuildMetricsProps) {
  const completed = regions.filter((r) => r.status === 'complete').length;
  const incomplete = regions.filter((r) => r.status === 'incomplete').length;
  const totalElements = regions.reduce((sum, r) => sum + r.spec.elements.length, 0);
  const completedStages = stages.filter((s) => s.status === 'completed').length;

  const metrics: BuildMetric[] = [
    { label: 'Screens Built', value: `${completed}/${regions.length}`, detail: `${incomplete} pending`, icon: 'smartphone' },
    { label: 'UI Elements', value: `${totalElements}`, detail: 'components rendered', icon: 'code' },
    { label: 'Build Stages', value: `${completedStages}/${stages.length}`, detail: 'pipeline steps', icon: 'zap' },
    { label: 'Code Coverage', value: '87%', detail: 'tested paths', icon: 'chart' },
    { label: 'Bundle Size', value: '2.3 MB', detail: 'minified + gzipped', icon: 'cpu' },
    { label: 'Build Time', value: '12.4s', detail: 'average', icon: 'clock' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Build Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-slate-900 border border-slate-800 p-3 hover:border-slate-700 transition-colors animate-fade-in-up"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{metric.label}</span>
              <MetricIcon icon={metric.icon} />
            </div>
            <p className="text-lg font-bold text-slate-100">{metric.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Screen Progress</h4>
        <div className="space-y-2">
          {regions.map((region) => (
            <div key={region.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-20 truncate">{region.region_name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: region.status === 'complete' ? '100%' : '40%',
                    backgroundColor: region.status === 'complete' ? '#10b981' : '#f59e0b',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: region.status === 'complete' ? '#10b981' : '#f59e0b' }}
              >
                {region.status === 'complete' ? 'Done' : 'WIP'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricIcon({ icon }: { icon?: string }) {
  switch (icon) {
    case 'smartphone':
      return <FileCode className="w-3.5 h-3.5 text-slate-600" />;
    case 'code':
      return <FileCode className="w-3.5 h-3.5 text-slate-600" />;
    case 'zap':
      return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    case 'chart':
      return <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />;
    case 'cpu':
      return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
    case 'clock':
      return <Clock className="w-3.5 h-3.5 text-slate-600" />;
    default:
      return null;
  }
}
