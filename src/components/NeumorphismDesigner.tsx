import { Circle, X } from 'lucide-react';
import { useState } from 'react';

export default function NeumorphismDesigner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [distance, setDistance] = useState(8);
  const [intensity, setIntensity] = useState(60);
  const [shape, setShape] = useState<'convex' | 'concave' | 'flat'>('convex');
  const [color, setColor] = useState('#e0e0e0');
  if (!open) return null;

  const shadow = `rgba(0,0,0,${intensity / 200})`;
  const light = `rgba(255,255,255,${intensity / 200})`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Circle className="w-5 h-5 text-slate-400" /><h3 className="text-sm font-semibold text-slate-100">Neumorphism Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="rounded-2xl p-8" style={{ backgroundColor: color }}>
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center" style={{ backgroundColor: color, boxShadow: shape === 'convex' ? `${distance}px ${distance}px ${distance * 2}px ${shadow}, -${distance}px -${distance}px ${distance * 2}px ${light}` : shape === 'concave' ? `inset ${distance}px ${distance}px ${distance * 2}px ${shadow}, inset -${distance}px -${distance}px ${distance * 2}px ${light}` : 'none', border: shape === 'flat' ? `1px solid ${shadow}` : 'none' }}>
                <span className="text-sm font-medium" style={{ color: `rgb(${100 - intensity / 3}, ${100 - intensity / 3}, ${100 - intensity / 3})` }}>Neu</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Shadow Distance</label><span className="text-xs font-mono text-slate-200">{distance}px</span></div><input type="range" min="2" max="20" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-slate-400" /></div>
            <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Shadow Intensity</label><span className="text-xs font-mono text-slate-200">{intensity}%</span></div><input type="range" min="10" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-slate-400" /></div>
            <div><label className="text-xs text-slate-400 mb-1 block">Shape</label><div className="grid grid-cols-3 gap-2">{(['convex', 'concave', 'flat'] as const).map(s => <button key={s} onClick={() => setShape(s)} className={`rounded-lg p-2 text-xs text-center capitalize ${shape === s ? 'bg-slate-800 text-slate-100' : 'bg-slate-800/50 text-slate-400'}`}>{s}</button>)}</div></div>
            <div className="flex items-center gap-3"><label className="text-xs text-slate-400">Base Color:</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700" /></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-slate-400 font-medium mb-1">CSS Output</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`.neu {\n  background: ${color};\n  box-shadow: ${shape === 'convex' ? '' : 'inset '}${distance}px ${distance}px ${distance * 2}px ${shadow}, ${shape === 'convex' ? '-' : 'inset -'}${distance}px -${distance}px ${distance * 2}px ${light};\n  border-radius: 16px;\n}`}</pre></div>
        </div>
      </div>
    </div>
  );
}
