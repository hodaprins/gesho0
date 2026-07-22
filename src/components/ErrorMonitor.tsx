import { useMemo } from 'react';
import { AlertTriangle, X, RefreshCw, Bug, Filter } from 'lucide-react';
import { generateErrorLog } from '@/lib/analytics';

interface ErrorMonitorProps {
  open: boolean;
  onClose: () => void;
  screenCount: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

export default function ErrorMonitor({ open, onClose, screenCount }: ErrorMonitorProps) {
  const errors = useMemo(() => generateErrorLog(screenCount), [screenCount]);

  if (!open) return null;

  const highCount = errors.filter((e) => e.severity === 'high').length;
  const mediumCount = errors.filter((e) => e.severity === 'medium').length;
  const lowCount = errors.filter((e) => e.severity === 'low').length;
  const totalCrashes = errors.reduce((s, e) => s + e.count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-slate-100">Error Monitor</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-lg font-bold text-red-400">{highCount}</p>
            <p className="text-[10px] text-slate-500">High</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-lg font-bold text-amber-400">{mediumCount}</p>
            <p className="text-[10px] text-slate-500">Medium</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-lg font-bold text-slate-400">{lowCount}</p>
            <p className="text-[10px] text-slate-500">Low</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-lg font-bold text-slate-200">{totalCrashes}</p>
            <p className="text-[10px] text-slate-500">Total</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {errors.map((err) => (
            <div
              key={err.id}
              className={`rounded-xl border p-3 animate-fade-in-up ${SEVERITY_COLORS[err.severity] ?? SEVERITY_COLORS.low}`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-200">{err.type}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{err.screen}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{err.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{err.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-500">Occured {err.count}x</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${SEVERITY_COLORS[err.severity]}`}>
                      {err.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
