import { useState } from 'react';
import { Lock, X, Check, X as XIcon, Server, Send, KeyRound, ShieldCheck } from 'lucide-react';

interface AuditItem {
  id: string;
  category: 'At Rest' | 'In Transit' | 'Key Management';
  check: string;
  algorithm: string;
  status: 'pass' | 'fail';
}

const ITEMS: AuditItem[] = [
  { id: '1', category: 'At Rest', check: 'Database encryption', algorithm: 'AES-256-GCM', status: 'pass' },
  { id: '2', category: 'At Rest', check: 'File storage (S3)', algorithm: 'AES-256-XTS', status: 'pass' },
  { id: '3', category: 'At Rest', check: 'Backup encryption', algorithm: 'AES-256-CBC', status: 'fail' },
  { id: '4', category: 'In Transit', check: 'API TLS version', algorithm: 'TLS 1.3', status: 'pass' },
  { id: '5', category: 'In Transit', check: 'WebSocket transport', algorithm: 'TLS 1.3', status: 'pass' },
  { id: '6', category: 'In Transit', check: 'Certificate pinning', algorithm: 'SPKI', status: 'fail' },
  { id: '7', category: 'Key Management', check: 'Key rotation', algorithm: 'KMS 90-day', status: 'pass' },
  { id: '8', category: 'Key Management', check: 'Envelope encryption', algorithm: 'AES-256 + RSA-4096', status: 'pass' },
];

const CAT_ICON: Record<string, React.ReactNode> = { 'At Rest': <Server className="w-4 h-4 text-cyan-400" />, 'In Transit': <Send className="w-4 h-4 text-violet-400" />, 'Key Management': <KeyRound className="w-4 h-4 text-amber-400" /> };

interface EncryptionAuditDashboardProps {
  open: boolean;
  onClose: () => void;
}

export default function EncryptionAuditDashboard({ open, onClose }: EncryptionAuditDashboardProps) {
  const [activeCat, setActiveCat] = useState<'all' | string>('all');
  if (!open) return null;
  const cats = ['At Rest', 'In Transit', 'Key Management'];
  const filtered = activeCat === 'all' ? ITEMS : ITEMS.filter((i) => i.category === activeCat);
  const passCount = ITEMS.filter((i) => i.status === 'pass').length;
  const score = Math.round((passCount / ITEMS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Lock className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Encryption Audit Dashboard</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /><span className="text-2xl font-bold text-slate-100">{score}%</span><span className="text-xs text-slate-500">encrypted</span></div>
          <div className="ml-auto flex items-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" />{passCount} pass</span>
            <span className="inline-flex items-center gap-1 text-red-400"><XIcon className="w-3 h-3" />{ITEMS.length - passCount} fail</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-800">
          <button onClick={() => setActiveCat('all')} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${activeCat === 'all' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>All</button>
          {cats.map((c) => <button key={c} onClick={() => setActiveCat(c)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${activeCat === c ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>{c}</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {filtered.map((i) => (
            <div key={i.id} className={`rounded-xl border p-3 ${i.status === 'pass' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex items-center gap-3">
                {i.status === 'pass' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <XIcon className="w-4 h-4 text-red-400 shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {CAT_ICON[i.category]}
                    <p className="text-sm font-medium text-slate-200">{i.check}</p>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{i.algorithm}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${i.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} capitalize`}>{i.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
