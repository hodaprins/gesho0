import { ScanLine, X, Box, Activity, Layers } from 'lucide-react';
import { useState } from 'react';

export default function LiDARScannerConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [depthRange, setDepthRange] = useState(5);
  const [meshRes, setMeshRes] = useState(50);
  const [pointDensity, setPointDensity] = useState(75);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ScanLine className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">LiDAR Scanner Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative w-48 h-48 rounded-xl bg-slate-950/50 border border-slate-800 overflow-hidden">
              <svg className="w-full h-full">
                {[...Array(8)].map((_, i) => <line key={i} x1="0" y1={i * 24 + 10} x2="192" y2={i * 24 + 10} stroke="#0e7490" strokeWidth="0.5" opacity={0.3} />)}
                {[...Array(8)].map((_, i) => <line key={i} x1={i * 24 + 10} y1="0" x2={i * 24 + 10} y2="192" stroke="#0e7490" strokeWidth="0.5" opacity={0.3} />)}
                {[...Array(40)].map((_, i) => <circle key={i} cx={20 + Math.random() * 152} cy={20 + Math.random() * 152} r={1 + Math.random() * 2} fill="#22d3ee" opacity={0.3 + Math.random() * 0.5} />)}
                <circle cx="96" cy="96" r="40" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Layers className="w-3 h-3" /> Depth Range</label><span className="text-xs font-mono text-slate-200">{depthRange}m</span></div><input type="range" min="1" max="10" value={depthRange} onChange={(e) => setDepthRange(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Box className="w-3 h-3" /> Mesh Resolution</label><span className="text-xs font-mono text-slate-200">{meshRes}%</span></div><input type="range" min="10" max="100" value={meshRes} onChange={(e) => setMeshRes(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Point Cloud Density</label><span className="text-xs font-mono text-slate-200">{pointDensity}%</span></div><input type="range" min="10" max="100" value={pointDensity} onChange={(e) => setPointDensity(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-cyan-400 font-medium mb-1">ARKit Scene Configuration</h4>
            <ul className="text-xs text-slate-400 space-y-0.5">
              <li>• ARWorldTrackingConfiguration with sceneDepth</li>
              <li>• ARMeshAnchor: real-time mesh geometry</li>
              <li>• Plane detection: horizontal + vertical</li>
              <li>• Frame rate: 60 FPS (A17 Pro optimized)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
