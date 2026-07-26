import { Brain, X, Cpu, Zap, CheckCircle2, Download } from 'lucide-react';
import { useState } from 'react';

const MODELS = [
  { id: 'resnet', name: 'ResNet50', size: '103 MB', task: 'Image Classification', accuracy: 94.2 },
  { id: 'bert', name: 'BERT-mini', size: '42 MB', task: 'Text Processing', accuracy: 89.1 },
  { id: 'mobilenet', name: 'MobileNetV3', size: '12 MB', task: 'Image Classification', accuracy: 91.8 },
  { id: 'yolo', name: 'YOLOv8-nano', size: '8 MB', task: 'Object Detection', accuracy: 87.5 },
  { id: 'whisper', name: 'Whisper-tiny', size: '77 MB', task: 'Speech Recognition', accuracy: 92.3 },
];

export default function CoreMLModelIntegrator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [compute, setCompute] = useState<'cpu' | 'gpu' | 'neural'>('neural');
  if (!open) return null;
  const m = MODELS[selected];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Core ML Model Integrator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {MODELS.map((model, i) => (
              <button key={model.id} onClick={() => setSelected(i)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${i === selected ? 'border-purple-500/30 bg-purple-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
                <Brain className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="flex-1"><p className="text-sm font-medium text-slate-200">{model.name}</p><p className="text-[10px] text-slate-500">{model.task}</p></div>
                <div className="text-right"><p className="text-xs text-slate-300">{model.size}</p><p className="text-[10px] text-emerald-400">{model.accuracy}%</p></div>
              </button>
            ))}
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Compute Units</h4>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: 'cpu', name: 'CPU', icon: <Cpu className="w-4 h-4" /> }, { id: 'gpu', name: 'GPU', icon: <Zap className="w-4 h-4" /> }, { id: 'neural', name: 'Neural Engine', icon: <Brain className="w-4 h-4" /> }].map(c => <button key={c.id} onClick={() => setCompute(c.id as 'cpu' | 'gpu' | 'neural')} className={`rounded-xl border p-3 text-center transition-colors ${compute === c.id ? 'border-purple-500/30 bg-purple-500/5 text-purple-400' : 'border-slate-800 text-slate-400'}`}>{c.icon}<p className="text-xs mt-1">{c.name}</p></button>)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-purple-400 font-medium mb-1">Input/Output Schema</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Input:</span><code className="text-slate-300">image (CVPixelBuffer, 224x224)</code></div>
              <div className="flex justify-between"><span className="text-slate-500">Output:</span><code className="text-slate-300">classLabel (String), probs (Dict)</code></div>
            </div>
          </div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-xs text-slate-400">Model downloaded and ready</span><button className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium"><Download className="w-3.5 h-3.5" /> Convert with coremltools</button></div>
        </div>
      </div>
    </div>
  );
}
