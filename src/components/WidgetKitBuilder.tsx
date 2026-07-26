import { LayoutDashboard, X, Clock, Calendar, Sun, Cloud } from 'lucide-react';
import { useState } from 'react';

const FAMILIES = [
  { id: 'systemSmall', name: 'Small', w: 155, h: 155 },
  { id: 'systemMedium', name: 'Medium', w: 329, h: 155 },
  { id: 'systemLarge', name: 'Large', w: 329, h: 345 },
  { id: 'accessoryRectangular', name: 'Accessory', w: 50, h: 25 },
];

export default function WidgetKitBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [family, setFamily] = useState(0);
  if (!open) return null;
  const f = FAMILIES[family];
  const scale = f.w > 200 ? 0.7 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">WidgetKit Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {FAMILIES.map((fam, i) => <button key={fam.id} onClick={() => setFamily(i)} className={`text-xs px-2.5 py-1 rounded-full ${i === family ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{fam.name}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 p-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: `${f.w * scale}px`, height: `${f.h * scale}px`, backgroundColor: '#1c1c1e' }}>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-white font-medium">My Widget</span><Sun className="w-3 h-3 text-amber-400" /></div>
                  {family === 0 && <div className="flex-1 flex flex-col justify-center items-center"><p className="text-3xl font-bold text-white">23°C</p><p className="text-[10px] text-slate-400">Sunny</p></div>}
                  {family === 1 && <div className="flex-1 flex"><div className="flex-1 flex flex-col justify-center"><p className="text-2xl font-bold text-white">23°C</p><p className="text-[10px] text-slate-400">Sunny</p></div><div className="w-px bg-slate-700 mx-2" /><div className="flex-1 flex flex-col justify-center space-y-1">{['12h', '3pm', '6pm', '9pm'].map((t, i) => <div key={t} className="flex items-center justify-between text-[8px] text-slate-400"><span>{t}</span><Cloud className="w-2.5 h-2.5 text-slate-500" /></div>)}</div></div>}
                  {family === 2 && <div className="flex-1 space-y-2"><div className="flex items-center justify-between"><p className="text-3xl font-bold text-white">23°C</p><Sun className="w-6 h-6 text-amber-400" /></div><div className="grid grid-cols-5 gap-1">{['12', '3', '6', '9', '12'].map((t, i) => <div key={i} className="text-center"><p className="text-[8px] text-slate-400">{t}</p><Cloud className="w-3 h-3 mx-auto text-slate-500" /><p className="text-[8px] text-white">{20 + i}°</p></div>)}</div></div>}
                  {family === 3 && <div className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-400" /><span className="text-[8px] text-white">23°</span></div>}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-blue-400 font-medium mb-1">Timeline Provider</h4>
            <code className="text-[10px] font-mono text-slate-500">TimelineProvider → getTimeline(in:completion:)</code>
            <p className="text-[10px] text-slate-500 mt-1">Refresh policy: after date • atEnd • never</p>
          </div>
        </div>
      </div>
    </div>
  );
}
