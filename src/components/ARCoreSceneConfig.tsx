import { Box, X } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  { id: 'depth', name: 'Depth API', desc: 'Real-time depth maps for occlusion' },
  { id: 'instant', name: 'Instant Placement', desc: 'Place objects before full tracking' },
  { id: 'augimg', name: 'Augmented Images', desc: 'Detect & track 2D images' },
  { id: 'cloud', name: 'Cloud Anchors', desc: 'Shared AR experiences across devices' },
  { id: 'hdr', name: 'Environmental HDR', desc: 'Realistic lighting from environment' },
  { id: 'semantic', name: 'Semantic Segmentation', desc: 'Identify sky, ground, people' },
];

export default function ARCoreSceneConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(['depth', 'instant', 'hdr']));
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Box className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">ARCore Scene Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Scene Features</h4><div className="space-y-1.5">{FEATURES.map(f => <button key={f.id} onClick={() => setEnabled(prev => { const n = new Set(prev); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; })} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><div><p className="text-xs text-slate-200">{f.name}</p><p className="text-[10px] text-slate-500">{f.desc}</p></div><div className={`w-4 h-4 rounded ${enabled.has(f.id) ? 'bg-emerald-400' : 'bg-slate-700'}`} /></button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-emerald-400 font-medium mb-1">Session Configuration</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`val config = Session(session.config)\nconfig.depthMode = Config.DepthMode.AUTOMATIC\nconfig.instantPlacementMode = Config.InstantPlacementMode.LOCAL\nconfig.lightEstimationMode = Config.LightEstimationMode.ENVIRONMENTAL_HDR\nsession.configure(config)`}</pre></div>
          <div className="grid grid-cols-3 gap-2"><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">60 FPS</p><p className="text-[10px] text-slate-500">Render Rate</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">2.5 GB</p><p className="text-[10px] text-slate-500">Max Memory</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">API 24+</p><p className="text-[10px] text-slate-500">Min Android</p></div></div>
        </div>
      </div>
    </div>
  );
}
