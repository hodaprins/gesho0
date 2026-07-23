import { ShieldCheck, X, AlertTriangle, Check, Lock, FileCode2, Database as DbIcon } from 'lucide-react';

interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  location: string;
  recommendation: string;
}

const VULNS: Vulnerability[] = [
  { id: '1', severity: 'high', title: 'Missing input validation', description: 'User inputs are not sanitized before processing', location: 'Login screen - email field', recommendation: 'Add server-side validation and sanitize all inputs' },
  { id: '2', severity: 'medium', title: 'Insecure data storage', description: 'Sensitive data stored in plain text locally', location: 'Settings - cache layer', recommendation: 'Use encrypted storage (Keychain/Keystore)' },
  { id: '3', severity: 'medium', title: 'No rate limiting', description: 'API endpoints lack rate limiting protection', location: 'API layer - auth endpoints', recommendation: 'Implement rate limiting (e.g., 100 req/min)' },
  { id: '4', severity: 'low', title: 'Verbose error messages', description: 'Error responses include stack traces in production', location: 'Global error handler', recommendation: 'Return generic errors in production builds' },
  { id: '5', severity: 'info', title: 'HTTPS enforced', description: 'All network traffic uses HTTPS', location: 'Network layer', recommendation: 'No action needed - good practice' },
  { id: '6', severity: 'info', title: 'Auth tokens encrypted', description: 'JWT tokens are stored securely', location: 'Auth service', recommendation: 'No action needed - good practice' },
];

const SEV_META: Record<string, { color: string; icon: React.ReactNode }> = {
  critical: { color: 'border-red-500/30 bg-red-500/5', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
  high: { color: 'border-red-500/30 bg-red-500/5', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
  medium: { color: 'border-amber-500/30 bg-amber-500/5', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
  low: { color: 'border-slate-600/30 bg-slate-600/5', icon: <AlertTriangle className="w-4 h-4 text-slate-400" /> },
  info: { color: 'border-emerald-500/30 bg-emerald-500/5', icon: <Check className="w-4 h-4 text-emerald-400" /> },
};

interface SecurityScannerProps {
  open: boolean;
  onClose: () => void;
}

export default function SecurityScanner({ open, onClose }: SecurityScannerProps) {
  if (!open) return null;
  const score = Math.max(0, 100 - VULNS.filter((v) => v.severity === 'high').length * 15 - VULNS.filter((v) => v.severity === 'medium').length * 8 - VULNS.filter((v) => v.severity === 'low').length * 3);
  const issues = VULNS.filter((v) => v.severity !== 'info');
  const passed = VULNS.filter((v) => v.severity === 'info');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Security Scanner</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{score}</p><p className="text-[10px] text-slate-500">Score</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{issues.filter((v) => v.severity === 'high').length}</p><p className="text-[10px] text-slate-500">High</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-amber-400">{issues.filter((v) => v.severity === 'medium').length}</p><p className="text-[10px] text-slate-500">Medium</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{passed.length}</p><p className="text-[10px] text-slate-500">Passed</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {VULNS.map((v) => (
            <div key={v.id} className={`rounded-xl border p-3 ${SEV_META[v.severity].color}`}>
              <div className="flex items-start gap-3">
                {SEV_META[v.severity].icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-200">{v.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize bg-slate-800 text-slate-400">{v.severity}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{v.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mb-1"><FileCode2 className="w-3 h-3" />{v.location}</div>
                  {v.severity !== 'info' && <p className="text-[10px] text-slate-500">Fix: {v.recommendation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
