import { PanelLeftClose, X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function FoldableSupportConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [layout, setLayout] = useState<'single' | 'dual' | 'spanning'>('dual');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><PanelLeftClose className="w-5 h-5 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-100">Foldable Device Support</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['single', 'dual', 'spanning'] as const).map(l => <button key={l} onClick={() => setLayout(l)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${layout === l ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{l}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex justify-center mb-4">
            <div className="relative" style={{ width: '300px', height: '400px' }}>
              {layout === 'single' && <div className="w-full h-full rounded-2xl border-4 border-slate-700 bg-slate-800/50" />}
              {layout === 'dual' && <div className="flex w-full h-full gap-0.5"><div className="flex-1 rounded-l-2xl border-4 border-slate-700 bg-slate-800/50" /><div className="w-1 bg-slate-600" /><div className="flex-1 rounded-r-2xl border-4 border-slate-700 bg-slate-800/50" /></div>}
              {layout === 'spanning' && <div className="w-full h-full rounded-2xl border-4 border-slate-700 bg-slate-800/50 flex items-center justify-center"><div className="w-1 h-full bg-slate-600/50 absolute left-1/2" /></div>}
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-indigo-400 font-medium mb-1">WindowSizeClass</h4>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                {[{ w: 'Compact', d: '< 600dp' }, { w: 'Medium', d: '600-840dp' }, { w: 'Expanded', d: '> 840dp' }].map(c => <div key={c.w} className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-slate-200 font-medium">{c.w}</p><p className="text-slate-500">{c.d}</p></div>)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-indigo-400 font-medium mb-1">Display Features</h4>
              <ul className="text-xs text-slate-400 space-y-1"><li>• FoldingFeature: hinge position & orientation</li><li>• DisplayCutout: avoid notch/punch-hole areas</li><li>• WindowLayoutInfo: real-time layout updates</li></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
