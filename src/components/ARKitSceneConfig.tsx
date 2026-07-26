import { Box, X, Eye, Hand, Scan, Sun } from 'lucide-react';
import { useState } from 'react';

const TRACKING = [
  { id: 'world', name: 'World Tracking', desc: 'Track device position in 3D space', icon: Box },
  { id: 'face', name: 'Face Tracking', desc: 'Track facial expressions (TrueDepth)', icon: Scan },
  { id: 'body', name: 'Body Tracking', desc: 'Track skeletal pose in 2D/3D', icon: Hand },
];

const FEATURES = [
  { id: 'planes', name: 'Plane Detection', desc: 'Horizontal & vertical surfaces' },
  { id: 'images', name: 'Image Anchors', desc: 'Recognize 2D images in 3D' },
  { id: 'objects', name: 'Object Scanning', desc: 'Detect 3D objects' },
  { id: 'light', name: 'Light Estimation', desc: 'Real-world ambient light' },
  { id: 'hdr', name: 'Environment HDR', desc: 'Reflections from environment' },
  { id: 'people', name: 'People Occlusion', desc: 'AR content behind people' },
];

export default function ARKitSceneConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tracking, setTracking] = useState('world');
  const [enabled, setEnabled] = useState<Set<string>>(new Set(['planes', 'light', 'people']));
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Box className="w-5 h-5 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-100">ARKit Scene Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tracking Mode</h4><div className="grid grid-cols-3 gap-2">{TRACKING.map(t => <button key={t.id} onClick={() => setTracking(t.id)} className={`rounded-xl border p-3 text-center transition-colors ${tracking === t.id ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-slate-800 bg-slate-950/40'}`}><t.icon className={`w-5 h-5 mx-auto mb-1 ${tracking === t.id ? 'text-indigo-400' : 'text-slate-500'}`} /><p className="text-xs text-slate-200">{t.name}</p></button>)}</div></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Scene Features</h4><div className="space-y-1.5">{FEATURES.map(f => <button key={f.id} onClick={() => setEnabled(prev => { const n = new Set(prev); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; })} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><div><p className="text-xs text-slate-200">{f.name}</p><p className="text-[10px] text-slate-500">{f.desc}</p></div><div className={`w-4 h-4 rounded ${enabled.has(f.id) ? 'bg-indigo-400' : 'bg-slate-700'}`} /></button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-indigo-400 font-medium mb-1">Configuration</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`let config = ARWorldTrackingConfiguration()\nconfig.planeDetection = [.horizontal, .vertical]\nconfig.frameSemantics = .personSegmentationWithDepth\nconfig.environmentTexturing = .automatic\nsceneView.session.run(config)`}</pre></div>
        </div>
      </div>
    </div>
  );
}
