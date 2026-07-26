import { MessageSquare, X, Cpu, Clock, Zap } from 'lucide-react';
import { useState } from 'react';

const MODELS = [
  { id: '1b', name: '1B params', size: '800 MB', ram: '1.2 GB', speed: 'Fast' },
  { id: '3b', name: '3B params', size: '2.1 GB', ram: '3.5 GB', speed: 'Medium' },
  { id: '7b', name: '7B params', size: '4.5 GB', ram: '6.8 GB', speed: 'Slow' },
];

export default function OnDeviceLLMConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [model, setModel] = useState(1);
  const [quant, setQuant] = useState<'INT4' | 'INT8'>('INT4');
  const [context, setContext] = useState(2048);
  if (!open) return null;
  const m = MODELS[model];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">On-Device LLM Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Model Size</h4><div className="grid grid-cols-3 gap-2">{MODELS.map((mdl, i) => <button key={mdl.id} onClick={() => setModel(i)} className={`rounded-xl border p-3 text-center transition-colors ${model === i ? 'border-purple-500/30 bg-purple-500/5' : 'border-slate-800 bg-slate-950/40'}`}><Cpu className={`w-5 h-5 mx-auto mb-1 ${model === i ? 'text-purple-400' : 'text-slate-500'}`} /><p className="text-xs text-slate-200">{mdl.name}</p><p className="text-[10px] text-slate-500">{mdl.size}</p></button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Quantization</h4><div className="grid grid-cols-2 gap-2">{(['INT4', 'INT8'] as const).map(q => <button key={q} onClick={() => setQuant(q)} className={`rounded-lg p-2 text-xs text-center ${quant === q ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-800'}`}>{q} {q === 'INT4' ? '(4-bit, smaller)' : '(8-bit, more accurate)'}</button>)}</div></div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Context Window</label><span className="text-xs font-mono text-slate-200">{context} tokens</span></div><input type="range" min="512" max="8192" step="512" value={context} onChange={(e) => setContext(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block">System Prompt</label><textarea defaultValue="You are a helpful assistant. Keep responses concise." className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 h-16 resize-none" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-purple-400">{quant === 'INT4' ? Math.round(Number(m.size.replace('GB', '')) * 0.5 * 10) / 10 : m.size}</p><p className="text-[10px] text-slate-500">Storage</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">{m.ram}</p><p className="text-[10px] text-slate-500">RAM Needed</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center flex items-center justify-center gap-1"><Zap className="w-3 h-3 text-amber-400" /><p className="text-sm font-bold text-amber-400">{m.speed}</p></div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"><p className="text-[10px] text-slate-400">LLM runs entirely offline. No data leaves the device. Powered by llama.cpp / MLX.</p></div>
        </div>
      </div>
    </div>
  );
}
