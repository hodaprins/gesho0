import { useState } from 'react';
import { ScanFace, X, Mail, Phone, CreditCard, Hash, FileCode2, Database } from 'lucide-react';

interface Finding {
  id: string;
  type: 'email' | 'phone' | 'ssn' | 'credit_card';
  value: string;
  location: string;
  source: 'code' | 'database';
  risk: 'high' | 'medium' | 'low';
}

const FINDINGS: Finding[] = [
  { id: '1', type: 'email', value: 'john.doe@example.com', location: 'src/seed/users.ts:42', source: 'code', risk: 'medium' },
  { id: '2', type: 'phone', value: '+1 (555) 014-8821', location: 'db:users.phone', source: 'database', risk: 'medium' },
  { id: '3', type: 'ssn', value: '123-45-6789', location: 'src/lib/identity.ts:18', source: 'code', risk: 'high' },
  { id: '4', type: 'credit_card', value: '4242 4242 4242 4242', location: 'db:payments.card_no', source: 'database', risk: 'high' },
  { id: '5', type: 'email', value: 'support@bolt.dev', location: 'src/components/Footer.tsx:9', source: 'code', risk: 'low' },
  { id: '6', type: 'phone', value: '+44 20 7946 0958', location: 'db:contacts.phone', source: 'database', risk: 'medium' },
];

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  email: { label: 'Email', icon: <Mail className="w-4 h-4 text-cyan-400" />, color: 'bg-cyan-500/20 text-cyan-400' },
  phone: { label: 'Phone', icon: <Phone className="w-4 h-4 text-violet-400" />, color: 'bg-violet-500/20 text-violet-400' },
  ssn: { label: 'SSN', icon: <Hash className="w-4 h-4 text-red-400" />, color: 'bg-red-500/20 text-red-400' },
  credit_card: { label: 'Credit Card', icon: <CreditCard className="w-4 h-4 text-amber-400" />, color: 'bg-amber-500/20 text-amber-400' },
};

const RISK_COLOR: Record<string, string> = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-emerald-500/20 text-emerald-400' };

interface PIIDataScannerProps {
  open: boolean;
  onClose: () => void;
}

export default function PIIDataScanner({ open, onClose }: PIIDataScannerProps) {
  const [filter, setFilter] = useState<'all' | 'code' | 'database'>('all');
  if (!open) return null;
  const filtered = filter === 'all' ? FINDINGS : FINDINGS.filter((f) => f.source === filter);
  const highCount = FINDINGS.filter((f) => f.risk === 'high').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ScanFace className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">PII Data Scanner</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{FINDINGS.length}</p><p className="text-[10px] text-slate-500">Findings</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{highCount}</p><p className="text-[10px] text-slate-500">High Risk</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-cyan-400">{new Set(FINDINGS.map((f) => f.type)).size}</p><p className="text-[10px] text-slate-500">Types</p></div>
        </div>

        <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-800">
          {(['all', 'code', 'database'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${filter === f ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>{f}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center gap-3 mb-2">
                {TYPE_META[f.type].icon}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TYPE_META[f.type].color}`}>{TYPE_META[f.type].label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${RISK_COLOR[f.risk]}`}>{f.risk}</span>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
                  {f.source === 'code' ? <FileCode2 className="w-3 h-3" /> : <Database className="w-3 h-3" />}{f.source}
                </div>
              </div>
              <p className="text-sm font-mono text-slate-200">{f.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">{f.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
