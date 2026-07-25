import { useState } from 'react';
import { ShieldCheck, X, Check, X as XIcon, AlertTriangle } from 'lucide-react';

interface Article {
  id: string;
  article: string;
  title: string;
  status: 'pass' | 'fail';
  detail: string;
}

const ARTICLES: Article[] = [
  { id: '1', article: 'Art. 6', title: 'Lawful basis for processing', status: 'pass', detail: 'Explicit consent captured at signup' },
  { id: '2', article: 'Art. 7', title: 'Conditions for consent', status: 'pass', detail: 'Consent is granular and withdrawable' },
  { id: '3', article: 'Art. 17', title: 'Right to erasure', status: 'fail', detail: 'No account-deletion endpoint detected' },
  { id: '4', article: 'Art. 20', title: 'Data portability', status: 'fail', detail: 'No export endpoint for user data' },
  { id: '5', article: 'Art. 33', title: 'Breach notification', status: 'pass', detail: 'Webhook alerts configured within 72h' },
  { id: '6', article: 'Art. 13', title: 'Transparency & info', status: 'pass', detail: 'Privacy policy linked in footer' },
  { id: '7', article: 'Art. 32', title: 'Security of processing', status: 'pass', detail: 'Data encrypted at rest (AES-256)' },
];

interface GDPRComplianceScannerProps {
  open: boolean;
  onClose: () => void;
}

export default function GDPRComplianceScanner({ open, onClose }: GDPRComplianceScannerProps) {
  const [scanning, setScanning] = useState(false);
  if (!open) return null;
  const passed = ARTICLES.filter((a) => a.status === 'pass').length;
  const score = Math.round((passed / ARTICLES.length) * 100);
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const ringColor = score >= 80 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">GDPR Compliance Scanner</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-800">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="8" strokeDasharray={`${(score / 100) * 264} 264`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-[9px] text-slate-500 uppercase">Score</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-200 font-medium">Compliance Assessment</p>
            <p className="text-xs text-slate-400 mt-0.5">{passed} of {ARTICLES.length} articles compliant</p>
            <button onClick={() => setScanning(!scanning)} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> {scanning ? 'Scanning…' : 'Re-scan'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {ARTICLES.map((a) => (
            <div key={a.id} className={`rounded-xl border p-3 ${a.status === 'pass' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex items-center gap-3">
                {a.status === 'pass' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <XIcon className="w-4 h-4 text-red-400 shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">{a.article}</span>
                    <p className="text-sm font-medium text-slate-200">{a.title}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{a.detail}</p>
                </div>
                {a.status === 'fail' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
