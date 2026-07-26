import { FileWarning, X, Check } from 'lucide-react';
import { useState } from 'react';

const RULE_CATEGORIES = [
  { id: 'errors', name: 'Possible Errors', rules: ['no-unused-vars', 'no-undef', 'no-console', 'no-debugger'] },
  { id: 'best', name: 'Best Practices', rules: ['eqeqeq', 'no-eval', 'no-implied-eval', 'prefer-const'] },
  { id: 'style', name: 'Stylistic Issues', rules: ['semi', 'quotes', 'indent', 'comma-dangle'] },
  { id: 'es6', name: 'ES6+', rules: ['arrow-body-style', 'no-var', 'prefer-template', 'no-useless-constructor'] },
];

export default function ESLintConfigEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(['no-unused-vars', 'no-undef', 'eqeqeq', 'prefer-const', 'semi', 'no-var', 'prefer-template']));
  if (!open) return null;

  const config = `// eslint.config.js (Flat Config)\nexport default [\n  { rules: {\n${Array.from(enabled).map(r => `    "${r}": "error"`).join(',\n')}\n  }}\n];`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><FileWarning className="w-5 h-5 text-yellow-400" /><h3 className="text-sm font-semibold text-slate-100">ESLint 9 Config Editor</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {RULE_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{cat.name}</h4>
              <div className="flex flex-wrap gap-1.5">
                {cat.rules.map(rule => <button key={rule} onClick={() => setEnabled(prev => { const n = new Set(prev); n.has(rule) ? n.delete(rule) : n.add(rule); return n; })} className={`text-xs px-2 py-1 rounded-full font-mono ${enabled.has(rule) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-500'}`}>{enabled.has(rule) && <Check className="w-2.5 h-2.5 inline mr-1" />}{rule}</button>)}
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 mt-3"><h4 className="text-xs text-yellow-400 font-medium mb-1">Flat Config Preview</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap max-h-32 overflow-auto">{config}</pre></div>
          <div className="grid grid-cols-3 gap-2"><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-yellow-400">{enabled.size}</p><p className="text-[10px] text-slate-500">Rules</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">v9</p><p className="text-[10px] text-slate-500">ESLint</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">0</p><p className="text-[10px] text-slate-500">Errors</p></div></div>
        </div>
      </div>
    </div>
  );
}
