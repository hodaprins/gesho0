import { Smartphone, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const MD3_COMPONENTS = ['TopAppBar', 'Button', 'Card', 'FAB', 'NavigationBar', 'TextField', 'Switch', 'Chip', 'Slider', 'Dialog'];

export default function JetpackComposePreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dark, setDark] = useState(false);
  if (!open) return null;
  const bg = dark ? '#1c1b1f' : '#fef7ff';
  const surface = dark ? '#2b2930' : '#ffffff';
  const primary = dark ? '#d0bcff' : '#6750a4';
  const text = dark ? '#e6e1e5' : '#1c1b1f';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-green-400" /><h3 className="text-sm font-semibold text-slate-100">Jetpack Compose Preview</h3></div>
          <div className="flex items-center gap-2"><button onClick={() => setDark(!dark)} className="text-slate-400 hover:text-slate-200">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button><button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col items-center">
          <div className="rounded-[2rem] border-[6px] border-slate-700 overflow-hidden" style={{ width: '280px', height: '500px', backgroundColor: bg }}>
            <div className="flex items-center justify-center py-2 text-[10px]" style={{ color: text }}>Material Design 3</div>
            <div className="px-3 pb-16 space-y-3 overflow-y-auto" style={{ height: 'calc(100% - 28px)' }}>
              <div className="rounded-xl p-3 text-xs font-semibold flex items-center justify-between" style={{ backgroundColor: surface, color: text }}>Top App Bar<div className="w-4 h-4 rounded-full" style={{ backgroundColor: primary }} /></div>
              <div className="rounded-2xl p-3 space-y-2" style={{ backgroundColor: surface }}>
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: primary, opacity: 0.6 }} />
                <div className="h-2 rounded w-1/2" style={{ backgroundColor: text, opacity: 0.3 }} />
              </div>
              <button className="w-full py-2.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: primary }}>Filled Button</button>
              <div className="flex gap-2"><span className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: primary, color: bg }}>Assist Chip</span><span className="px-3 py-1 rounded-full text-[10px] border" style={{ borderColor: primary, color: text }}>Filter</span></div>
              <div className="flex items-center justify-between rounded-xl p-3" style={{ backgroundColor: surface }}><span className="text-xs" style={{ color: text }}>Switch</span><div className="w-8 h-5 rounded-full p-0.5 flex items-center" style={{ backgroundColor: primary }}><div className="w-4 h-4 rounded-full bg-white ml-auto" /></div></div>
              <div className="rounded-full w-12 h-12 flex items-center justify-center text-white ml-auto" style={{ backgroundColor: primary }}>+</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2" style={{ backgroundColor: surface, width: '280px', borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}>
              {['Home', 'Search', 'Settings'].map((t, i) => <div key={t} className="flex flex-col items-center gap-0.5"><div className="w-4 h-4 rounded" style={{ backgroundColor: i === 0 ? primary : text, opacity: i === 0 ? 1 : 0.4 }} /><span className="text-[8px]" style={{ color: i === 0 ? primary : text, opacity: 0.6 }}>{t}</span></div>)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">{MD3_COMPONENTS.map(c => <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400">{c}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
