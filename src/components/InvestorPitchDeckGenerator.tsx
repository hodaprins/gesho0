import { Presentation, X, FileText } from 'lucide-react';
import { useState } from 'react';

interface Slide {
  id: string;
  title: string;
  content: string;
  label: string;
}

interface InvestorPitchDeckGeneratorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const SLIDES: Slide[] = [
  { id: crypto.randomUUID(), label: 'Problem', title: 'The Problem', content: '43% of teams struggle with disjointed tooling that slows delivery and burns budget.' },
  { id: crypto.randomUUID(), label: 'Solution', title: 'Our Solution', content: 'A unified workspace that replaces five tools with one, cutting setup time by 70%.' },
  { id: crypto.randomUUID(), label: 'Market', title: 'Market Opportunity', content: 'A $42B addressable market growing 18% YoY across SMB and mid-market segments.' },
  { id: crypto.randomUUID(), label: 'Traction', title: 'Traction', content: '12k signups in 90 days, 38% MoM revenue growth, 4.8★ average rating.' },
  { id: crypto.randomUUID(), label: 'Ask', title: 'The Ask', content: 'Raising $2.5M seed to scale go-to-market and double the engineering team.' },
];

export default function InvestorPitchDeckGenerator({ open, onClose, appName }: InvestorPitchDeckGeneratorProps) {
  const [slides, setSlides] = useState<Slide[]>(SLIDES);
  const [selected, setSelected] = useState(0);

  if (!open) return null;

  const current = slides[selected];

  const updateSlide = (field: 'title' | 'content', value: string) => {
    setSlides((prev) => prev.map((s) => (s.id === current.id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Presentation className="w-5 h-5 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-100">Pitch Deck — {appName}</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}>
                <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 shrink-0" /><span className="font-medium truncate">{s.label}</span></div>
                <span className="text-[9px] text-slate-600">Slide {i + 1}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{current.label}</span>
            <input value={current.title} onChange={(e) => updateSlide('title', e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 focus:outline-none focus:border-indigo-500" />
            <textarea value={current.content} onChange={(e) => updateSlide('content', e.target.value)} rows={6}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none" />
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Live Preview</p>
              <p className="text-sm font-bold text-slate-200">{current.title}</p>
              <p className="text-xs text-slate-400 mt-1">{current.content}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Slide {selected + 1} of {slides.length}</span>
              <div className="flex gap-2">
                <button onClick={() => setSelected((p) => Math.max(0, p - 1))} className="px-2 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40" disabled={selected === 0}>Prev</button>
                <button onClick={() => setSelected((p) => Math.min(slides.length - 1, p + 1))} className="px-2 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40" disabled={selected === slides.length - 1}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
