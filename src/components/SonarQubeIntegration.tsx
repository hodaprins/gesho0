import { ScanSearch, X, Check, AlertTriangle, CircleDollarSign } from 'lucide-react';

const ISSUES = [
  { id: '1', severity: 'critical', message: 'Null pointer dereference in UserService.ts:42', effort: '30min' },
  { id: '2', severity: 'major', message: 'Unused private method getData() in ApiClient.ts', effort: '5min' },
  { id: '3', severity: 'minor', message: 'Function complexity too high in parser.ts:88', effort: '1h' },
  { id: '4', severity: 'info', message: 'Replace tab with space convention', effort: '2min' },
];

export default function SonarQubeIntegration({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ScanSearch className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">SonarQube Integration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-sm font-bold text-emerald-400">A</p><p className="text-[10px] text-slate-500">Quality Gate</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">87%</p><p className="text-[10px] text-slate-500">Coverage</p></div>
          <div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-sm font-bold text-amber-400">2.3%</p><p className="text-[10px] text-slate-500">Duplication</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">4h</p><p className="text-[10px] text-slate-500">Tech Debt</p></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {ISSUES.map(issue => (
            <div key={issue.id} className={`rounded-lg border p-3 ${issue.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : issue.severity === 'major' ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
              <div className="flex items-center gap-2 mb-1">
                {issue.severity === 'critical' ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : issue.severity === 'major' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <Check className="w-3.5 h-3.5 text-slate-400" />}
                <span className="text-xs text-slate-200 flex-1">{issue.message}</span>
                <span className={`text-[10px] uppercase font-medium ${issue.severity === 'critical' ? 'text-red-400' : issue.severity === 'major' ? 'text-amber-400' : 'text-slate-500'}`}>{issue.severity}</span>
              </div>
              <div className="flex items-center gap-2 ml-5"><CircleDollarSign className="w-3 h-3 text-slate-500" /><span className="text-[10px] text-slate-500">Effort: {issue.effort}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
