import { Watch, X, Circle } from 'lucide-react';
import { useState } from 'react';

const COMPLICATION_SLOTS = ['Left', 'Right', 'Top', 'Bottom', 'Background'];

export default function WearOSBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState<'tile' | 'watchface'>('tile');
  const [complications, setComplications] = useState<Record<string, string>>({ Left: 'Heart Rate', Right: 'Steps', Top: 'Date', Bottom: 'Weather', Background: 'None' });
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Watch className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Wear OS Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['tile', 'watchface'] as const).map(t => <button key={t} onClick={() => setType(t)} className={`text-xs px-2.5 py-1 rounded-full capitalize ${type === t ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{t}</button>)}
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center">
              <Circle className="absolute inset-2 w-auto h-auto rounded-full border border-slate-800 text-slate-700" />
              <div className="text-center z-10"><p className="text-2xl font-bold text-slate-200">10:30</p><p className="text-[10px] text-slate-500">Wed, Jul 26</p></div>
              {complications.Left !== 'None' && <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-amber-400">{complications.Left}</div>}
              {complications.Right !== 'None' && <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-emerald-400">{complications.Right}</div>}
              {complications.Top !== 'None' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400">{complications.Top}</div>}
              {complications.Bottom !== 'None' && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-purple-400">{complications.Bottom}</div>}
            </div>
          </div>
          <div className="w-48 border-l border-slate-800 overflow-y-auto scrollbar-thin p-3 shrink-0">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Complications</h4>
            <div className="space-y-1.5">
              {COMPLICATION_SLOTS.map(slot => (
                <div key={slot}><span className="text-[10px] text-slate-500">{slot}</span><select value={complications[slot]} onChange={(e) => setComplications(p => ({ ...p, [slot]: e.target.value }))} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-[10px] text-slate-200"><option>None</option><option>Heart Rate</option><option>Steps</option><option>Date</option><option>Weather</option><option>Battery</option></select></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
