import { Layers, X } from 'lucide-react';
import { useState } from 'react';

export default function GlassmorphismDesigner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(50);
  const [sat, setSat] = useState(180);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Glassmorphism Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-full max-w-sm h-48 rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl p-6 w-48 text-center" style={{ backdropFilter: `blur(${blur}px) saturate(${sat}%)`, WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}%)`, backgroundColor: `rgba(255,255,255,${opacity / 100})`, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <p className="text-sm font-medium text-slate-800">Glass Card</p>
                  <p className="text-xs text-slate-600 mt-1">Frosted effect preview</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Blur Intensity</label><span className="text-xs font-mono text-slate-200">{blur}px</span></div><input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Background Opacity</label><span className="text-xs font-mono text-slate-200">{opacity}%</span></div><input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Saturation</label><span className="text-xs font-mono text-slate-200">{sat}%</span></div><input type="range" min="100" max="300" value={sat} onChange={(e) => setSat(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-cyan-400 font-medium mb-1">CSS Output</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`.glass {\n  backdrop-filter: blur(${blur}px) saturate(${sat}%);\n  background: rgba(255,255,255,${(opacity / 100).toFixed(2)});\n  border: 1px solid rgba(255,255,255,0.3);\n  border-radius: 16px;\n}`}</pre></div>
        </div>
      </div>
    </div>
  );
}
