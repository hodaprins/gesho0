import { BrainCircuit, X, Check, Download, Cpu } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  { id: 'text', name: 'Text Recognition', size: '42 MB', onDevice: true },
  { id: 'face', name: 'Face Detection', size: '8 MB', onDevice: true },
  { id: 'barcode', name: 'Barcode Scanning', size: '4 MB', onDevice: true },
  { id: 'label', name: 'Image Labeling', size: '12 MB', onDevice: true },
  { id: 'translate', name: 'Translation', size: '45 MB', onDevice: false },
  { id: 'smartreply', name: 'Smart Reply', size: '6 MB', onDevice: true },
];

export default function MLKitIntegrator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(['text', 'barcode']));
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">ML Kit Integrator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {FEATURES.map(f => (
            <button key={f.id} onClick={() => setEnabled(prev => { const n = new Set(prev); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; })} className={`w-full flex items-center gap-3 rounded-xl border p-3 transition-colors ${enabled.has(f.id) ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
              <BrainCircuit className={`w-4 h-4 ${enabled.has(f.id) ? 'text-orange-400' : 'text-slate-500'}`} />
              <div className="flex-1 text-left"><p className="text-xs text-slate-200">{f.name}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-slate-500">{f.size}</span>{f.onDevice ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">On-device</span> : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Cloud</span>}</div></div>
              {enabled.has(f.id) ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-slate-600" />}
            </button>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 mt-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-orange-400" /><span className="text-xs text-slate-200">Total Download Size</span></div><span className="text-sm font-bold text-orange-400">{Array.from(enabled).reduce((s, id) => s + Number(FEATURES.find(f => f.id === id)?.size.replace(' MB', '') ?? 0), 0)} MB</span></div></div>
        </div>
      </div>
    </div>
  );
}
