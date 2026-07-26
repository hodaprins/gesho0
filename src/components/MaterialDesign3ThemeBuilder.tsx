import { Palette, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const ROLES = ['primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'secondary', 'tertiary', 'error', 'surface', 'surfaceVariant', 'background', 'outline'];

function generateScheme(seed: string): Record<string, string> {
  const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return {
    primary: `hsl(${hue}, 40%, 45%)`,
    onPrimary: '#ffffff',
    primaryContainer: `hsl(${hue}, 70%, 85%)`,
    onPrimaryContainer: `hsl(${hue}, 60%, 20%)`,
    secondary: `hsl(${(hue + 30) % 360}, 30%, 45%)`,
    tertiary: `hsl(${(hue + 60) % 360}, 35%, 45%)`,
    error: '#b3261e',
    surface: '#fef7ff',
    surfaceVariant: '#e7e0ec',
    background: '#fef7ff',
    outline: '#79747e',
  };
}

export default function MaterialDesign3ThemeBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [seed, setSeed] = useState('#6750a4');
  const scheme = generateScheme(seed);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Palette className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Material Design 3 Theme</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">Seed color:</label>
            <input type="color" value={seed.length === 7 ? seed : '#6750a4'} onChange={(e) => setSeed(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700" />
            <input value={seed} onChange={(e) => setSeed(e.target.value)} className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200" />
            <button className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-xs"><Sparkles className="w-3.5 h-3.5" /> Generate</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => (
              <div key={role} className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="h-12" style={{ backgroundColor: scheme[role] }} />
                <div className="p-2 bg-slate-950/40"><p className="text-xs text-slate-200">{role}</p><p className="text-[10px] font-mono text-slate-500 truncate">{scheme[role]}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
