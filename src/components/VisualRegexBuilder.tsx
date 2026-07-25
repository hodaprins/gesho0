import { Regex, X, Check, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';

interface RegexPattern {
  id: string;
  name: string;
  pattern: string;
  testString: string;
  flags: string;
}

const PRESETS: RegexPattern[] = [
  { id: '1', name: 'Email', pattern: '^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,}$', testString: 'john@example.com', flags: 'g' },
  { id: '2', name: 'Phone (US)', pattern: '^\\+?1?\\(?(\\d{3})\\)?[\\s.-]?(\\d{3})[\\s.-]?(\\d{4})$', testString: '+1 (555) 123-4567', flags: 'g' },
  { id: '3', name: 'URL', pattern: '^https?://[\\w.-]+\\.[a-z]{2,}(/[\\w./-]*)?$', testString: 'https://example.com/path', flags: 'gi' },
  { id: '4', name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', testString: 'MyStr0ng@Pass', flags: 'g' },
  { id: '5', name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', testString: '2026-07-23', flags: 'g' },
];

interface VisualRegexBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function VisualRegexBuilder({ open, onClose }: VisualRegexBuilderProps) {
  const [patterns, setPatterns] = useState<RegexPattern[]>(PRESETS);
  const [selected, setSelected] = useState(0);
  if (!open) return null;

  const current = patterns[selected];
  const matches = useMemo(() => {
    try {
      const regex = new RegExp(current.pattern, current.flags);
      return { valid: true, matched: regex.test(current.testString), error: null };
    } catch (e) {
      return { valid: false, matched: false, error: String(e) };
    }
  }, [current]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Regex className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Regex Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800 overflow-x-auto scrollbar-thin">
          {patterns.map((p, i) => <button key={p.id} onClick={() => setSelected(i)} className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{p.name}</button>)}
          <button onClick={() => setPatterns((p) => [...p, { id: crypto.randomUUID(), name: 'New', pattern: '', testString: '', flags: 'g' }])} className="text-slate-500 hover:text-slate-300"><Plus className="w-3.5 h-3.5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Pattern</label>
            <div className="flex items-center gap-2">
              <code className="text-xs text-slate-600">/</code>
              <input value={current.pattern} onChange={(e) => setPatterns((p) => p.map((x, i) => i === selected ? { ...x, pattern: e.target.value } : x))} className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none" />
              <code className="text-xs text-slate-600">/{current.flags}</code>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Test String</label>
            <input value={current.testString} onChange={(e) => setPatterns((p) => p.map((x, i) => i === selected ? { ...x, testString: e.target.value } : x))} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none" />
          </div>
          <div className={`rounded-xl border p-3 ${matches.valid ? (matches.matched ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5') : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex items-center gap-2">
              {matches.valid ? (matches.matched ? <><Check className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400">Match found! Pattern is valid.</span></> : <><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-xs text-amber-400">No match. Test string doesn't fit pattern.</span></>) : <><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs text-red-400">Invalid regex: {matches.error}</span></>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
