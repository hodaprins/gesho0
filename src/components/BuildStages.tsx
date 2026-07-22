import {
  Search,
  Brain,
  Layout,
  Palette,
  Smartphone,
  Database,
  Code2,
  TestTube,
  Rocket,
  Check,
  Loader2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import type { StageType, BuildStage } from '@/types/builder';

const STAGE_ICONS: Record<StageType, React.ReactNode> = {
  analysis: <Brain className="w-4 h-4" />,
  scaffold: <Layout className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  screens: <Smartphone className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  logic: <Code2 className="w-4 h-4" />,
  testing: <TestTube className="w-4 h-4" />,
  deploy: <Rocket className="w-4 h-4" />,
};

interface BuildStagesProps {
  stages: BuildStage[];
  activeLog: string;
}

export default function BuildStages({ stages, activeLog }: BuildStagesProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-200">Build Pipeline</h2>
        </div>
        <span className="text-xs text-slate-500 ml-auto">
          {stages.filter((s) => s.status === 'completed').length}/{stages.length} done
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1.5">
        {stages.map((stage, idx) => (
          <StageRow key={stage.id} stage={stage} index={idx} />
        ))}
      </div>

      <div className="border-t border-slate-800 bg-slate-950/80 p-3">
        <div className="rounded-lg bg-black/40 border border-slate-800 p-3 font-mono text-xs h-28 overflow-y-auto scrollbar-thin">
          {activeLog ? (
            <span className="text-emerald-400 cursor-blink">{activeLog}</span>
          ) : (
            <span className="text-slate-600">Waiting for output...</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StageRow({ stage, index }: { stage: BuildStage; index: number }) {
  const icon = STAGE_ICONS[stage.stage_type as StageType] ?? <Search className="w-4 h-4" />;

  const statusIcon =
    stage.status === 'completed' ? (
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Check className="w-3 h-3 text-emerald-400" />
      </div>
    ) : stage.status === 'in_progress' ? (
      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
        <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
      </div>
    ) : stage.status === 'failed' ? (
      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertCircle className="w-3 h-3 text-red-400" />
      </div>
    ) : (
      <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
        <Circle className="w-2 h-2 text-slate-600" />
      </div>
    );

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
        stage.status === 'in_progress'
          ? 'bg-slate-800/60 border border-slate-700'
          : stage.status === 'completed'
            ? 'opacity-70'
            : 'opacity-40'
      } animate-fade-in-up`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="text-slate-400 shrink-0">{icon}</div>
      <span className="text-sm text-slate-300 flex-1 truncate">{stage.stage_name}</span>
      {statusIcon}
    </div>
  );
}
