import { Droplet, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function DynamicColorThemes({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [source, setSource] = useState('#0ea5e9');
  if (!open) return null;

  const generatePalette = (base: string) => {
    const hex = base.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return [0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map(m => `rgb(${Math.min(255, Math.round(r * m))}, ${Math.min(255, Math.round(g * m))}, ${Math.min(255, Math.round(b * m))})`);
  };
  const palette = generatePalette(source);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Droplet className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Dynamic Color Themes</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex items-center gap-3"><label className="text-xs text-slate-400">Source color:</label><input type="color" value={source} onChange={(e) => setSource(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700" /><code className="text-xs font-mono text-slate-200">{source}</code><button className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs"><Sparkles className="w-3.5 h-3.5" /> Extract from wallpaper</button></div>
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Generated Palette (Material You)</h4><div className="flex rounded-xl overflow-hidden h-16">{palette.map((c, i) => <div key={i} className="flex-1 relative group" style={{ backgroundColor: c }}><span className="absolute bottom-1 left-1 text-[8px] text-white/60 font-mono">{i + 1}</span></div>)}</div></div>
          <div className="grid grid-cols-2 gap-2">
            <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Light Theme</h4><div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: palette[4] }}><div className="h-3 rounded w-3/4" style={{ backgroundColor: palette[0] }} /><div className="h-3 rounded w-1/2" style={{ backgroundColor: palette[1] }} /><div className="h-7 rounded-lg" style={{ backgroundColor: palette[0] }} /></div></div>
            <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Dark Theme</h4><div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: palette[0] }}><div className="h-3 rounded w-3/4" style={{ backgroundColor: palette[5] }} /><div className="h-3 rounded w-1/2" style={{ backgroundColor: palette[4] }} /><div className="h-7 rounded-lg" style={{ backgroundColor: palette[5] }} /></div></div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-cyan-400 font-medium mb-1">Dynamic Color API</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`// Material You (Android 12+)\nDynamicColors.applyToActivityIfAvailable(this)\n\n// iOS Tinted Icons\nconfiguration.setAlternativeIconName("tinted")`}</pre></div>
        </div>
      </div>
    </div>
  );
}
