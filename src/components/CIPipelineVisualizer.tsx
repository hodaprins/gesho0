import { GitBranch, X, Check, Loader2, AlertCircle, Clock } from 'lucide-react';

interface PipelineStep {
  id: string;
  name: string;
  status: 'success' | 'running' | 'pending' | 'failed';
  duration: string;
}

const STEPS: PipelineStep[] = [
  { id: '1', name: 'Install dependencies', status: 'success', duration: '12s' },
  { id: '2', name: 'Lint & Type Check', status: 'success', duration: '8s' },
  { id: '3', name: 'Unit Tests', status: 'success', duration: '24s' },
  { id: '4', name: 'Build Bundle', status: 'success', duration: '18s' },
  { id: '5', name: 'E2E Tests', status: 'running', duration: '...' },
  { id: '6', name: 'Deploy to Staging', status: 'pending', duration: '-' },
  { id: '7', name: 'Smoke Tests', status: 'pending', duration: '-' },
  { id: '8', name: 'Deploy to Production', status: 'pending', duration: '-' },
];

interface CIPipelineVisualizerProps {
  open: boolean;
  onClose: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  success: <Check className="w-4 h-4 text-emerald-400" />,
  running: <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
  pending: <Clock className="w-4 h-4 text-slate-600" />,
  failed: <AlertCircle className="w-4 h-4 text-red-400" />,
};

export default function CIPipelineVisualizer({ open, onClose }: CIPipelineVisualizerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">CI/CD Pipeline</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-1">
          <div className="rounded-lg bg-slate-800/50 p-3 mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-200">main · commit a3f9c2d</p>
              <p className="text-[10px] text-slate-500">Triggered by push · 2m 42s elapsed</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">Running</span>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-800" />
            {STEPS.map((step, i) => (
              <div key={step.id} className="relative flex items-center gap-3 py-2 pl-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                  step.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  step.status === 'running' ? 'bg-cyan-500/10 border-cyan-500/30' :
                  step.status === 'failed' ? 'bg-red-500/10 border-red-500/30' :
                  'bg-slate-800 border-slate-700'
                }`}>
                  {ICONS[step.status]}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>{step.name}</p>
                </div>
                <span className="text-[10px] text-slate-600 font-mono">{step.duration}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500 mb-1">Latest log output:</p>
            <pre className="text-[10px] font-mono text-slate-400 leading-relaxed">
{`> Running E2E tests...
> ✓ Login flow (1.2s)
> ✓ Navigation test (0.8s)
> ◷ Form submission (running...)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
