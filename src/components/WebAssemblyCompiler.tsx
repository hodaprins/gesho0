import { Binary, X, Cpu, Zap, Download } from 'lucide-react';
import { useState } from 'react';

const LANGS = [
  { id: 'rust', name: 'Rust', icon: '🦀', size: '42 KB', opt: 3 },
  { id: 'cpp', name: 'C++', icon: '⚙️', size: '38 KB', opt: 3 },
  { id: 'c', name: 'C', icon: '🔧', size: '31 KB', opt: 2 },
  { id: 'as', name: 'AssemblyScript', icon: '📜', size: '45 KB', opt: 3 },
  { id: 'zig', name: 'Zig', icon: '⚡', size: '35 KB', opt: 3 },
];

export default function WebAssemblyCompiler({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lang, setLang] = useState(0);
  const [optLevel, setOptLevel] = useState(3);
  const [memLimit, setMemLimit] = useState(128);
  if (!open) return null;
  const l = LANGS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Binary className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">WebAssembly Compiler</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Source Language</h4>
            <div className="grid grid-cols-5 gap-2">
              {LANGS.map((lng, i) => <button key={lng.id} onClick={() => setLang(i)} className={`rounded-xl border p-3 text-center transition-colors ${i === lang ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40'}`}><span className="text-xl block">{lng.icon}</span><span className="text-[10px] text-slate-300">{lng.name}</span></button>)}
            </div>
          </div>
          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Optimization Level</label><span className="text-xs font-mono text-slate-200">-O{optLevel}</span></div><div className="grid grid-cols-4 gap-1">{[0, 1, 2, 3].map(o => <button key={o} onClick={() => setOptLevel(o)} className={`text-xs py-1 rounded ${optLevel === o ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>-O{o}</button>)}</div></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Memory Limit</label><span className="text-xs font-mono text-slate-200">{memLimit} MB</span></div><input type="range" min="16" max="1024" step="16" value={memLimit} onChange={(e) => setMemLimit(Number(e.target.value))} className="w-full accent-amber-500" /></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-amber-400 font-medium mb-2">Export Functions</h4>
            <div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-300">process(data: *const u8, len: usize)</span><span className="text-emerald-400">→ i32</span></div><div className="flex justify-between"><span className="text-slate-300">allocate(size: usize)</span><span className="text-emerald-400">→ *mut u8</span></div><div className="flex justify-between"><span className="text-slate-300">deallocate(ptr: *mut u8)</span><span className="text-emerald-400">→ void</span></div></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-amber-400">{l.size}</p><p className="text-[10px] text-slate-500">Output</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">{memLimit}MB</p><p className="text-[10px] text-slate-500">Memory</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">100x</p><p className="text-[10px] text-slate-500">vs JS</p></div>
          </div>
          <button className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold"><Download className="w-3.5 h-3.5" /> Compile to .wasm</button>
        </div>
      </div>
    </div>
  );
}
