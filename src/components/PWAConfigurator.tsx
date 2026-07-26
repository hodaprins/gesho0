import { Globe, X, Smartphone, Download, Wifi } from 'lucide-react';
import { useState } from 'react';

export default function PWAConfigurator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('My App');
  const [theme, setTheme] = useState('#0f766e');
  const [display, setDisplay] = useState<'standalone' | 'fullscreen' | 'minimal-ui'>('standalone');
  if (!open) return null;

  const manifest = JSON.stringify({ name, short_name: name.slice(0, 12), theme_color: theme, background_color: theme, display, start_url: '/', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">PWA Configurator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div><label className="text-xs text-slate-500 mb-1 block">App Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
          <div className="flex items-center gap-3"><label className="text-xs text-slate-500">Theme Color:</label><input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700" /><code className="text-xs font-mono text-slate-300">{theme}</code></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Display Mode</label><div className="grid grid-cols-3 gap-2">{(['standalone', 'fullscreen', 'minimal-ui'] as const).map(d => <button key={d} onClick={() => setDisplay(d)} className={`rounded-lg p-2 text-xs text-center transition-colors ${display === d ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-800'}`}>{d}</button>)}</div></div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">manifest.json Preview</h4>
            <pre className="text-[10px] font-mono text-cyan-400 bg-slate-950/50 rounded-lg p-3 overflow-auto max-h-48"><code>{manifest}</code></pre>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><Download className="w-4 h-4 text-cyan-400 mb-1" /><p className="text-xs text-slate-200">Installable</p><p className="text-[10px] text-slate-500">Add to home screen</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><Wifi className="w-4 h-4 text-emerald-400 mb-1" /><p className="text-xs text-slate-200">Offline Ready</p><p className="text-[10px] text-slate-500">Service worker cached</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
