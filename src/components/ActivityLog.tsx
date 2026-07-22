import { useMemo } from 'react';
import {
  Activity,
  Plus,
  Smartphone,
  Palette,
  Code2,
  TestTube,
  Gauge,
  Rocket,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import { generateActivityLog } from '@/lib/analytics';

const ICONS: Record<string, React.ReactNode> = {
  plus: <Plus className="w-3.5 h-3.5" />,
  screen: <Smartphone className="w-3.5 h-3.5" />,
  palette: <Palette className="w-3.5 h-3.5" />,
  code: <Code2 className="w-3.5 h-3.5" />,
  test: <TestTube className="w-3.5 h-3.5" />,
  audit: <Gauge className="w-3.5 h-3.5" />,
  deploy: <Rocket className="w-3.5 h-3.5" />,
};

interface ActivityLogProps {
  appName: string;
}

export default function ActivityLog({ appName }: ActivityLogProps) {
  const activities = useMemo(() => generateActivityLog(appName), [appName]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Recent Activity</h3>
      </div>

      <div className="relative space-y-3">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-800" />
        {activities.map((act) => (
          <div key={act.id} className="relative flex gap-3 animate-fade-in-up">
            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10 text-slate-400">
              {ICONS[act.icon] ?? <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-xs text-slate-200">
                <span className="font-medium">{act.action}</span>{' '}
                <span className="text-slate-400">{act.target}</span>
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
