import { AlignLeft, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function PrettierConfigEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [printWidth, setPrintWidth] = useState(80);
  const [tabWidth, setTabWidth] = useState(2);
  const [semi, setSemi] = useState(true);
  const [singleQuote, setSingleQuote] = useState(true);
  const [trailingComma, setTrailingComma] = useState<'none' | 'es5' | 'all'>('all');
  const [bracketSpacing, setBracketSpacing] = useState(true);
  if (!open) return null;

  const unformatted = `const user={name:"John",age:30,email:"john@example.com",roles:["admin","user"]};`;
  const formatted = `const user = {\n  name: 'John',\n  age: 30,\n  email: 'john@example.com',\n  roles: ['admin', 'user'],\n};`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><AlignLeft className="w-5 h-5 text-pink-400" /><h3 className="text-sm font-semibold text-slate-100">Prettier 3.0 Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Print Width</label><span className="text-xs font-mono text-slate-200">{printWidth}</span></div><input type="range" min="60" max="140" value={printWidth} onChange={(e) => setPrintWidth(Number(e.target.value))} className="w-full accent-pink-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Tab Width</label><span className="text-xs font-mono text-slate-200">{tabWidth}</span></div><input type="range" min="1" max="8" value={tabWidth} onChange={(e) => setTabWidth(Number(e.target.value))} className="w-full accent-pink-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setSemi(!semi)} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><span className="text-xs text-slate-200">Semicolons</span><span className={`text-xs ${semi ? 'text-emerald-400' : 'text-slate-600'}`}>{semi ? 'true' : 'false'}</span></button>
            <button onClick={() => setSingleQuote(!singleQuote)} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><span className="text-xs text-slate-200">Single Quote</span><span className={`text-xs ${singleQuote ? 'text-emerald-400' : 'text-slate-600'}`}>{singleQuote ? 'true' : 'false'}</span></button>
            <button onClick={() => setBracketSpacing(!bracketSpacing)} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><span className="text-xs text-slate-200">Bracket Spacing</span><span className={`text-xs ${bracketSpacing ? 'text-emerald-400' : 'text-slate-600'}`}>{bracketSpacing ? 'true' : 'false'}</span></button>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><span className="text-xs text-slate-200">Trailing Comma</span><select value={trailingComma} onChange={(e) => setTrailingComma(e.target.value as 'none' | 'es5' | 'all')} className="bg-slate-800 text-xs text-slate-200 rounded px-1 py-0.5"><option value="none">none</option><option value="es5">es5</option><option value="all">all</option></select></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[10px] text-slate-500 mb-1">Before:</p><pre className="text-[10px] font-mono text-red-400 whitespace-pre-wrap break-all">{unformatted}</pre></div>
              <div><p className="text-[10px] text-slate-500 mb-1">After:</p><pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap">{formatted}</pre></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-pink-400 font-medium mb-1">.prettierrc</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{JSON.stringify({ printWidth, tabWidth, semi, singleQuote, trailingComma, bracketSpacing }, null, 2)}</pre></div>
        </div>
      </div>
    </div>
  );
}
