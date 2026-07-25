import { Sparkles, X, Search, Zap } from 'lucide-react';
import { useState } from 'react';

interface MicroInteraction {
  id: string;
  name: string;
  category: 'hover' | 'tap' | 'appear' | 'feedback' | 'drag';
  description: string;
  cssPreview: string;
  icon: string;
}

const INTERACTIONS: MicroInteraction[] = [
  { id: '1', name: 'Ripple Effect', category: 'tap', description: 'Material-style ripple on tap', cssPreview: 'animation: ripple 0.3s ease-out', icon: '🌊' },
  { id: '2', name: 'Bounce on Appear', category: 'appear', description: 'Element bounces in from bottom', cssPreview: 'animation: bounce-in 0.5s spring', icon: '🟢' },
  { id: '3', name: 'Scale on Hover', category: 'hover', description: 'Element scales up 5% on hover', cssPreview: 'transform: scale(1.05)', icon: '🔍' },
  { id: '4', name: 'Shake on Error', category: 'feedback', description: 'Input shakes horizontally on error', cssPreview: 'animation: shake 0.3s', icon: '❌' },
  { id: '5', name: 'Glow Pulse', category: 'feedback', description: 'Element pulses with soft glow', cssPreview: 'animation: glow 2s infinite', icon: '✨' },
  { id: '6', name: 'Card Lift', category: 'hover', description: 'Card lifts with shadow on hover', cssPreview: 'transform: translateY(-4px)', icon: '🃏' },
  { id: '7', name: 'Slide In', category: 'appear', description: 'Slides in from left', cssPreview: 'animation: slide-in 0.3s ease-out', icon: '➡️' },
  { id: '8', name: 'Haptic Tap', category: 'tap', description: 'Scales down briefly on tap', cssPreview: 'transform: scale(0.95)', icon: '👆' },
  { id: '9', name: 'Drag Shadow', category: 'drag', description: 'Element casts shadow when dragged', cssPreview: 'box-shadow: 0 8px 24px rgba(0,0,0,0.3)', icon: '🫳' },
  { id: '10', name: 'Confetti Success', category: 'feedback', description: 'Burst of confetti on success', cssPreview: 'animation: confetti 1s', icon: '🎉' },
  { id: '11', name: 'Morph Button', category: 'tap', description: 'Button morphs into loading spinner', cssPreview: 'animation: morph 0.4s', icon: '🔄' },
  { id: '12', name: 'Parallax Scroll', category: 'appear', description: 'Background moves slower than content', cssPreview: 'transform: translateY(scroll * 0.5)', icon: '🌌' },
];

const CATEGORIES = ['all', 'hover', 'tap', 'appear', 'feedback', 'drag'] as const;

interface MicroInteractionLibraryProps {
  open: boolean;
  onClose: () => void;
}

export default function MicroInteractionLibrary({ open, onClose }: MicroInteractionLibraryProps) {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  if (!open) return null;

  const filtered = INTERACTIONS.filter((i) => (category === 'all' || i.category === category) && i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Micro-Interactions</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-2 border-b border-slate-800 space-y-2">
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search interactions..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none" /></div>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">{CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${category === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{c}</button>)}</div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((int) => (
              <button key={int.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left hover:border-cyan-500/30 transition-colors">
                <div className="text-3xl mb-2">{int.icon}</div>
                <p className="text-sm font-medium text-slate-200">{int.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{int.description}</p>
                <code className="text-[9px] text-cyan-400/60 font-mono block mt-1 truncate">{int.cssPreview}</code>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
