import { Moon, X, Sun, Contrast } from 'lucide-react';
import { useState } from 'react';

export default function DarkModeDesigner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [amoled, setAmoled] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  if (!open) return null;
  const bg = amoled ? '#000000' : '#1a1a2e';
  const surface = amoled ? '#0a0a0a' : '#16213e';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-100">Dark Mode 2.0 Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center gap-4">
            <div className="rounded-2xl p-4 w-40" style={{ backgroundColor: '#ffffff' }}><div className="h-3 bg-slate-200 rounded w-3/4 mb-2" /><div className="h-3 bg-slate-100 rounded w-1/2 mb-3" /><div className="h-8 rounded-lg bg-blue-500" /></div>
            <div className="rounded-2xl p-4 w-40" style={{ backgroundColor: bg }}><div className="h-3 rounded w-3/4 mb-2" style={{ backgroundColor: surface }} /><div className="h-3 rounded w-1/2 mb-3" style={{ backgroundColor: surface }} /><div className="h-8 rounded-lg bg-indigo-500" /></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs"><Sun className="w-4 h-4 text-amber-400" /><span className="text-slate-400">Light</span><div className="w-8 h-4 rounded-full bg-slate-700 p-0.5"><div className="w-3 h-3 rounded-full bg-indigo-400 ml-auto" /></div><span className="text-slate-400">Dark</span><Moon className="w-4 h-4 text-indigo-400" /></div>
          <div className="space-y-2">
            <button onClick={() => setAmoled(!amoled)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">AMOLED Pure Black</p><p className="text-[10px] text-slate-500">True black background (#000) saves battery</p></div><span className={`text-xs ${amoled ? 'text-emerald-400' : 'text-slate-600'}`}>{amoled ? 'ON' : 'OFF'}</span></button>
            <button onClick={() => setAutoSwitch(!autoSwitch)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">Auto Theme Switching</p><p className="text-[10px] text-slate-500">Follow system preference (prefers-color-scheme)</p></div><span className={`text-xs ${autoSwitch ? 'text-emerald-400' : 'text-slate-600'}`}>{autoSwitch ? 'ON' : 'OFF'}</span></button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-indigo-400 font-medium mb-2 flex items-center gap-1.5"><Contrast className="w-3 h-3" /> Contrast Ratios</h4><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">Text on surface:</span><span className="text-emerald-400">15.2:1 (AAA)</span></div><div className="flex justify-between"><span className="text-slate-500">Secondary text:</span><span className="text-emerald-400">8.5:1 (AAA)</span></div><div className="flex justify-between"><span className="text-slate-500">Accent on bg:</span><span className="text-amber-400">4.8:1 (AA)</span></div></div></div>
        </div>
      </div>
    </div>
  );
}
