import { Cpu, X, Zap, Activity } from 'lucide-react';
import { useState } from 'react';

const MODELS = [
  { id: 'mobilenet', name: 'MobileNetV3', size: '12 MB', quant: 'INT8' },
  { id: 'efficientnet', name: 'EfficientNet-Lite', size: '18 MB', quant: 'INT8' },
  { id: 'bert', name: 'MobileBERT', size: '25 MB', quant: 'INT8' },
  { id: 'deeplab', name: 'DeepLab v3', size: '42 MB', quant: 'INT8' },
];

const DELEGATES = [
  { id: 'cpu', name: 'CPU', desc: 'Universal compatibility' },
  { id: 'gpu', name: 'GPU', desc: 'Hardware acceleration' },
  { id: 'nnapi', name: 'NNAPI', desc: 'Android Neural Network API' },
  { id: 'coreml', name: 'Core ML', desc: 'iOS Neural Engine' },
];

export default function TensorFlowLiteConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [delegate, setDelegate] = useState('gpu');
  if (!open) return null;
  const m = MODELS[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Cpu className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">TensorFlow Lite Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Model Selection</h4><div className="space-y-1.5">{MODELS.map((model, i) => <button key={model.id} onClick={() => setSelected(i)} className={`w-full flex items-center gap-3 rounded-xl border p-3 transition-colors ${i === selected ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-800 bg-slate-950/40'}`}><Cpu className={`w-4 h-4 ${i === selected ? 'text-orange-400' : 'text-slate-500'}`} /><div className="flex-1 text-left"><p className="text-xs text-slate-200">{model.name}</p><p className="text-[10px] text-slate-500">{model.size} · {model.quant}</p></div></button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Delegate</h4><div className="grid grid-cols-2 gap-2">{DELEGATES.map(d => <button key={d.id} onClick={() => setDelegate(d.id)} className={`rounded-xl border p-3 text-left transition-colors ${delegate === d.id ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-800 bg-slate-950/40'}`}><p className="text-xs text-slate-200">{d.name}</p><p className="text-[10px] text-slate-500">{d.desc}</p></button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-orange-400 font-medium mb-2 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Performance Benchmark</h4><div className="grid grid-cols-3 gap-2"><div className="text-center"><p className="text-sm font-bold text-emerald-400">8ms</p><p className="text-[10px] text-slate-500">Inference</p></div><div className="text-center"><p className="text-sm font-bold text-slate-200">120 FPS</p><p className="text-[10px] text-slate-500">Throughput</p></div><div className="text-center"><p className="text-sm font-bold text-orange-400">{m.size}</p><p className="text-[10px] text-slate-500">Model Size</p></div></div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-orange-400 font-medium mb-1">Input/Output Tensors</h4><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">Input:</span><code className="text-slate-300">float32[1, 224, 224, 3]</code></div><div className="flex justify-between"><span className="text-slate-500">Output:</span><code className="text-slate-300">float32[1, 1001]</code></div></div></div>
        </div>
      </div>
    </div>
  );
}
