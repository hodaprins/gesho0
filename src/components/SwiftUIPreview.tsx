import { Phone, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function SwiftUIPreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dark, setDark] = useState(false);
  if (!open) return null;
  const bg = dark ? '#000000' : '#f2f2f7';
  const surface = dark ? '#1c1c1e' : '#ffffff';
  const text = dark ? '#ffffff' : '#000000';
  const accent = '#007aff';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">SwiftUI Preview</h3></div>
          <div className="flex items-center gap-2"><button onClick={() => setDark(!dark)} className="text-slate-400 hover:text-slate-200">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button><button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col items-center">
          <div className="rounded-[2.5rem] border-[7px] border-slate-700 overflow-hidden relative" style={{ width: '280px', height: '500px', backgroundColor: bg }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-700 rounded-b-2xl z-20" />
            <div className="pt-10 pb-16 overflow-y-auto h-full" style={{ color: text }}>
              <div className="px-4 py-2 text-center"><p className="text-lg font-bold">NavigationStack</p></div>
              <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{ backgroundColor: surface }}>
                {['Settings', 'Profile', 'Notifications', 'Privacy', 'About'].map((item, i) => (
                  <div key={item} className="flex items-center justify-between px-4 py-3 border-b border-slate-700/30 last:border-0">
                    <span className="text-xs">{item}</span>
                    <span className="text-xs" style={{ color: accent }}>›</span>
                  </div>
                ))}
              </div>
              <div className="mx-4 mb-3"><button className="w-full py-3 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: accent }}>Button</button></div>
              <div className="mx-4 mb-3 rounded-xl p-3" style={{ backgroundColor: surface }}>
                <p className="text-xs mb-2">Form Section</p>
                <div className="flex items-center justify-between"><span className="text-xs">Toggle</span><div className="w-10 h-6 rounded-full p-0.5" style={{ backgroundColor: accent }}><div className="w-5 h-5 rounded-full bg-white ml-auto" /></div></div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2" style={{ backgroundColor: dark ? '#1c1c1e' : '#ffffff', borderTop: `1px solid ${dark ? '#333' : '#ddd'}` }}>
              {[{ l: 'Home', a: true }, { l: 'Search', a: false }, { l: 'Settings', a: false }].map(t => <div key={t.l} className="flex flex-col items-center"><div className="w-4 h-4 rounded" style={{ backgroundColor: t.a ? accent : '#999' }} /><span className="text-[8px] mt-0.5" style={{ color: t.a ? accent : '#999' }}>{t.l}</span></div>)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">{['NavigationStack', 'List', 'TabView', 'Button', 'Form', 'Toggle', 'Alert', 'Sheet'].map(c => <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400">{c}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
