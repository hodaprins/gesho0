import { Sparkles, X, Check, Zap } from 'lucide-react';
import { useState } from 'react';

const PROVIDERS = [
  { id: 'copilot', name: 'GitHub Copilot', desc: 'AI pair programmer' },
  { id: 'codeium', name: 'Codeium', desc: 'Free AI code completion' },
  { id: 'tabby', name: 'Tabby', desc: 'Self-hosted AI assistant' },
  { id: 'cody', name: 'Sourcegraph Cody', desc: 'Code intelligence + AI' },
];

export default function AICodeCompletion({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [provider, setProvider] = useState(0);
  const [mode, setMode] = useState<'inline' | 'chat'>('inline');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">AI Code Completion</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Provider</h4><div className="space-y-1.5">{PROVIDERS.map((p, i) => <button key={p.id} onClick={() => setProvider(i)} className={`w-full flex items-center gap-3 rounded-xl border p-3 transition-colors ${i === provider ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-800 bg-slate-950/40'}`}><Sparkles className={`w-4 h-4 ${i === provider ? 'text-cyan-400' : 'text-slate-500'}`} /><div className="flex-1 text-left"><p className="text-xs text-slate-200">{p.name}</p><p className="text-[10px] text-slate-500">{p.desc}</p></div>{i === provider && <Check className="w-4 h-4 text-cyan-400" />}</button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Completion Mode</h4><div className="grid grid-cols-2 gap-2">{(['inline', 'chat'] as const).map(m => <button key={m} onClick={() => setMode(m)} className={`rounded-lg p-2 text-xs text-center capitalize ${mode === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-800'}`}>{m === 'inline' ? 'Inline (Tab to accept)' : 'Chat sidebar'}</button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-cyan-400 font-medium mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Preview</h4>
            <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`function getUser(id: string) {${mode === 'inline' ? '\n  // AI suggests:\n  return fetch(`/api/users/${id}`)\n    .then(res => res.json());' : '\n  // Ask AI in chat sidebar\n  // "Write a function to fetch user by ID"'}`}</pre>
          </div>
          <div className="grid grid-cols-3 gap-2"><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">20+</p><p className="text-[10px] text-slate-500">Languages</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-cyan-400">~50ms</p><p className="text-[10px] text-slate-500">Latency</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">92%</p><p className="text-[10px] text-slate-500">Accept Rate</p></div></div>
        </div>
      </div>
    </div>
  );
}
