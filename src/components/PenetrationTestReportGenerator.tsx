import { useState } from 'react';
import { Bug, X, ExternalLink, Shield, Zap, Wrench } from 'lucide-react';

interface Vulnerability {
  id: string;
  title: string;
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  difficulty: 'trivial' | 'easy' | 'moderate' | 'hard';
  location: string;
  remediation: string;
}

const VULNS: Vulnerability[] = [
  { id: '1', title: 'SQL Injection in search endpoint', cve: 'CVE-2024-3129', severity: 'critical', difficulty: 'easy', location: '/api/search?q=', remediation: 'Use parameterized queries; validate and escape all input' },
  { id: '2', title: 'XSS in user bio field', cve: 'CVE-2024-4810', severity: 'high', difficulty: 'moderate', location: 'ProfileView.tsx:bio', remediation: 'Sanitize HTML output; enforce CSP headers' },
  { id: '3', title: 'IDOR on order detail route', cve: 'CVE-2024-5621', severity: 'high', difficulty: 'easy', location: '/api/orders/:id', remediation: 'Add ownership checks before returning resources' },
  { id: '4', title: 'Weak password reset token', cve: 'CVE-2024-6233', severity: 'medium', difficulty: 'hard', location: 'auth/reset.ts', remediation: 'Use 256-bit random tokens; expire after 15 min' },
  { id: '5', title: 'Missing rate limit on OTP', cve: 'CVE-2024-7744', severity: 'medium', difficulty: 'trivial', location: '/api/otp/send', remediation: 'Throttle to 3 attempts per 10 minutes per IP' },
];

const SEV_BADGE: Record<string, string> = { critical: 'bg-red-500/20 text-red-400 border-red-500/30', high: 'bg-orange-500/20 text-orange-400 border-orange-500/30', medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30', low: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
const DIFF_ICON: Record<string, React.ReactNode> = { trivial: <Zap className="w-3 h-3 text-red-400" />, easy: <Zap className="w-3 h-3 text-orange-400" />, moderate: <Shield className="w-3 h-3 text-amber-400" />, hard: <Shield className="w-3 h-3 text-emerald-400" /> };

interface PenetrationTestReportGeneratorProps {
  open: boolean;
  onClose: () => void;
}

export default function PenetrationTestReportGenerator({ open, onClose }: PenetrationTestReportGeneratorProps) {
  const [expanded, setExpanded] = useState<string | null>('1');
  if (!open) return null;
  const counts = { critical: VULNS.filter((v) => v.severity === 'critical').length, high: VULNS.filter((v) => v.severity === 'high').length, medium: VULNS.filter((v) => v.severity === 'medium').length };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Bug className="w-5 h-5 text-red-400" /><h3 className="text-sm font-semibold text-slate-100">Penetration Test Report</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-red-500/10 p-2 text-center border border-red-500/20"><p className="text-lg font-bold text-red-400">{counts.critical}</p><p className="text-[10px] text-slate-500">Critical</p></div>
          <div className="rounded-lg bg-orange-500/10 p-2 text-center border border-orange-500/20"><p className="text-lg font-bold text-orange-400">{counts.high}</p><p className="text-[10px] text-slate-500">High</p></div>
          <div className="rounded-lg bg-amber-500/10 p-2 text-center border border-amber-500/20"><p className="text-lg font-bold text-amber-400">{counts.medium}</p><p className="text-[10px] text-slate-500">Medium</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{VULNS.length}</p><p className="text-[10px] text-slate-500">Total</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {VULNS.map((v) => (
            <div key={v.id} className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
              <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="w-full flex items-center gap-3 p-3 text-left">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize ${SEV_BADGE[v.severity]}`}>{v.severity}</span>
                <p className="text-sm font-medium text-slate-200 flex-1 truncate">{v.title}</p>
                {DIFF_ICON[v.difficulty]}
              </button>
              {expanded === v.id && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">{v.cve}</span>
                    <span className="inline-flex items-center gap-0.5 text-slate-500">Exploit: <span className="capitalize text-slate-300">{v.difficulty}</span></span>
                    <a href="#" className="ml-auto inline-flex items-center gap-0.5 text-slate-500 hover:text-cyan-400">NVD <ExternalLink className="w-2.5 h-2.5" /></a>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">{v.location}</p>
                  <div className="flex items-start gap-1.5 text-xs text-slate-400"><Wrench className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /><span><span className="text-slate-300 font-medium">Remediation: </span>{v.remediation}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">Test run: {new Date().toLocaleDateString()} · Scope: full stack</span>
          <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-slate-900 text-xs font-semibold"><Bug className="w-3.5 h-3.5" /> Export report</button>
        </div>
      </div>
    </div>
  );
}
